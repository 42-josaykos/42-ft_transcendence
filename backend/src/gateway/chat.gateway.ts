import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import Channel from 'src/api/channels/entities/channel.entity';
import User from 'src/api/users/entities/user.entity';
import { ChannelsService } from 'src/api/channels/channels.service';
import { UsersService } from 'src/api/users/users.service';
import { AuthService } from 'src/auth/auth.service';
import { UpdateUserDTO } from 'src/api/users/dto/update-user.dto';
import { getRepository } from 'typeorm';
import { TypeORMSession } from 'src/auth/entities/session.entity';
import { MessagesService } from 'src/api/messages/messages.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

class Connections {
  userID: number;
  socketID: string[];
}

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: 'http://localhost:3001',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly channelsService: ChannelsService,
    private readonly usersService: UsersService,
    private readonly messagesService: MessagesService,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');
  private connectedClients: Connections[] = new Array();
  /*
    Connection
  */
  async handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.server.to(client.id).emit('askInfo')
  }

  /*
    Deconnection
  */
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);

    const userIndex = this.connectedClients.findIndex(
      (connection) => connection.socketID.indexOf(client.id) !== -1,
    );

    // Should never append, but prevention is better than cure
    if (userIndex === -1) {
      console.log('Client: ', client);
      console.log('Connected Clients: ', this.connectedClients);
      throw new WsException('Disconnecting user was not found');
    }

    // Removing socketID from corresponding user
    this.connectedClients[userIndex].socketID.splice(
      this.connectedClients[userIndex].socketID.indexOf(client.id),
      1,
    );

    // If the user has no more connected sockets, user is offline: removing it and sending updated list
    if (!this.connectedClients[userIndex].socketID.length) {
      this.connectedClients.splice(userIndex, 1);
    }
    console.log('Clients connected after disconnect: ', this.connectedClients);

  }

  @SubscribeMessage('sendInfo')
  async sendInfo(@ConnectedSocket() client: Socket,
            @MessageBody() data: User) {

    const userIndex = this.connectedClients.findIndex(
      (connection) => connection.userID === data.id,
    );
    if (userIndex === -1) {
    this.connectedClients.push({ userID: data.id, socketID: [client.id] });
    }
    else {
      this.connectedClients[userIndex].socketID.push(client.id);
    }

    console.log('Clients connected after connect: ', this.connectedClients);
  }

  /*
    New message
  */
  @SubscribeMessage('newMessage')
  async newMessage(client: Socket, data: any) {
    const message = data[0];
    const user = data[1];

    let channel = message.channel;
    [channel] = await this.channelsService.getChannelsByFilter({
      id: channel.id,
      members: true,
      mutes: false,
      bans: false
    });

    const members = channel.members;
    const usersMuted = channel.mutes;
    const usersBaned = channel.bans;

    if (
      usersMuted.findIndex((el: any) => el.user.id == user.id) != -1 ||
      usersBaned.findIndex((el: any) => el.user.id == user.id) != -1
    ) {
      return;
    }

    const newMessage = await this.messagesService.createMessage(message);
    newMessage.author = user;

    for (const member of members) {
      const index = this.connectedClients.findIndex((el) => el.userID === member.id)
      if (index != -1) {
        const socketIds = this.connectedClients[index].socketID;
        for (const socketId of socketIds) {
          this.server.to(socketId).emit('newMessage', newMessage);
        }
      }
    }
  }

  /*
    New Channel
  */
  @SubscribeMessage('newChannel')
  async newChannel(client: Socket, data: any) {
    const channel = data[0];
    const message = data[1];
    const userID = data[2];

    let newChannel = await this.channelsService.createChannel(channel);
    if (message != null) {
      message.channel.id = newChannel.id;
    }

    [newChannel] = await this.channelsService.getChannelsByFilter({
      id: newChannel.id,
      members: true,
      mutes: false,
      bans: false,
      invites: false,
      owner: false
    });

    const [user] = await this.usersService.getUsersByFilter({
      id: userID.id,
    });
    this.server.emit('newChannel', { newChannel, message, user });
  }

  /*

    Join Channel
  */
  @SubscribeMessage('joinChannel')
  async joinChannel(client: Socket, data: any) {
    const userID = data[0];
    const channel = data[1];
    const password = data[2];

    if (channel.password) {
      if (password) {
        const isPasswordMatching = await bcrypt.compare(
          password,
          channel.password,
        );
        if (!isPasswordMatching) {
          console.log('Password false');
          return;
        }
      } else {
        console.log('Password false');
        return;
      }
    }
    const index = this.connectedClients.findIndex((el) => el.userID === userID)
    if (index != -1) {
      const socketIds = this.connectedClients[index].socketID;
      for (const socketId of socketIds) {
        this.server.to(socketId).emit('joinChannel');
      }
    }
  }

  /*
    Delete Channel
  */
  @SubscribeMessage('deleteChannel')
  async deleteChannel(client: Socket, channelID: number) {
    let [channel] = await this.channelsService.getChannelsByFilter({
      id: channelID,
      invites: true,
    });

    if (channel.invites != []) {
      for (const invite of channel.invites) {
        const index = this.connectedClients.findIndex((el) => el.userID === invite.id)
        if (index != -1) {
          const socketIds = this.connectedClients[index].socketID;
          for (const socketId of socketIds) {
            this.server.to(socketId).emit('uninviteChannel', channel);
          }
        }
      }
    }

    await this.channelsService.deleteChannel(channelID);
    this.server.emit('deleteChannel', channelID);
  }

  /*
    Invite Channel
  */
  @SubscribeMessage('inviteChannel')
  async inviteChannel(client: Socket, data: any[]) {
    if (data[1] != null) {
      const channel = data[0];
      const invites = data[1];

      for (const invite of invites) {
        const index = this.connectedClients.findIndex((el) => el.userID === invite.id)
        if (index != -1) {
          const socketIds = this.connectedClients[index].socketID;
          for (const socketId of socketIds) {
            this.server.to(socketId).emit('inviteChannel', channel);
           }
        }
      }
    }
  }

/*
  Update Invite
*/
@SubscribeMessage('updateInvite')
async updateInvite(client: Socket, data: any[]) {
  if (data[1] != null) {
    const inviteChannel = data[0];
    const inviteBool = data[1];
    const userID = data[2]
  
    const index = this.connectedClients.findIndex((el) => el.userID === userID)
    if (index != -1) {
      const socketIds = this.connectedClients[index].socketID;
      for (const socketId of socketIds) {
        this.server.to(socketId).emit('updateInvite', {inviteChannel, inviteBool});
      }
    }
  }
}

  /*
    Update Member Channel
  */
  @SubscribeMessage('updateMember')
  async updateMember(client: Socket, data: any) {
    const channelID = data[0];
    const updateChannel = data[1];
    const message = data[2];
    const user = data[3];
    console.log("updateChannel => ", updateChannel)

    let userMember :User = undefined;
    if (updateChannel.removeMembers != undefined) {
      userMember = updateChannel.removeMembers[0]
    }
    let userAddBan :User = undefined;
    if (updateChannel.addBans != undefined) {
      userAddBan = updateChannel.addBans[0].user
    }
    let userRemoveBan :User = undefined;
    if (updateChannel.removeBans != undefined) {
      userRemoveBan = updateChannel.removeBans[0].user
      console.log("userRemoveBan => ", userRemoveBan)
    }
    let userAddMute :User = undefined;
    if (updateChannel.addMutes != undefined) {
      userAddMute = updateChannel.addMutes[0].user
    }
    let userRemoveMute :User = undefined;
    if (updateChannel.removeMutes != undefined) {
      userRemoveMute = updateChannel.removeMutes[0].user
    }
    
    const newChannel = await this.channelsService.updateChannel(
      channelID,
      updateChannel,
    );
    console.log("newChannel => ", newChannel)
    let [channel] = await this.channelsService.getChannelsByFilter({
      id: channelID,
      members: true,
    });
    console.log("Channel => ", channel)
    const members = channel.members;
    console.log("members => ", members)
    for (const member of members) {
      const index = this.connectedClients.findIndex((el) => el.userID === member.id)
      console.log("index => ", index)
      if (index != -1) {
        const socketIds = this.connectedClients[index].socketID;
        for (const socketId of socketIds) {
          this.server.to(socketId).emit('updateMember', newChannel);
          if (userAddBan != undefined && this.connectedClients[index].userID == userAddBan.id) {
            this.server.to(socketId).emit('userAddBan', newChannel)
          }
          if (userRemoveBan != undefined && this.connectedClients[index].userID == userRemoveBan.id) {
            console.log(">>>> 2222 ")
            this.server.to(socketId).emit('userRemoveBan', newChannel)
          }
          if (userAddMute != undefined && this.connectedClients[index].userID == userAddMute.id) {
            this.server.to(socketId).emit('userAddMute', newChannel)
          }
          if (userRemoveMute != undefined && this.connectedClients[index].userID == userRemoveMute.id) {
            this.server.to(socketId).emit('userRemoveMute', newChannel)
          }
        }
      }
    }

  if (userMember != undefined) {
    const index = this.connectedClients.findIndex((el) => el.userID === userMember.id)
    if (index !=-1) {
      if (userMember != undefined && this.connectedClients[index].userID == userMember.id) {
        const socketIds = this.connectedClients[index].socketID;
        for (const socketId of socketIds) {
          this.server.to(socketId).emit('userRemoveMember', newChannel)
        }
      }
    }
  }

    if (message != null) {
      this.newMessage(client, [message, user]);
    }
  }

  /*
    Update Channel
  */
  @SubscribeMessage('updateChannel')
  async updateChannel(client: Socket, data: any) {
    const channelID = data[0];
    const updateChannel = data[1];

    if (updateChannel.removeInvites != []) {
      for (const invite of updateChannel.removeInvites) {
        const index = this.connectedClients.findIndex((el) => el.userID === invite.id)
        if (index != -1) {
          const socketIds = this.connectedClients[index].socketID;
          for (const socketId of socketIds) {
            this.server.to(socketId).emit('uninviteChannel', updateChannel);
           }
        }
      }
    }

    const newChannel = await this.channelsService.updateChannel(
      channelID,
      updateChannel,
    );
    this.server.emit('updateMember', newChannel);
  }

  @SubscribeMessage('addUserBlocked')
  async addUserBlocked(client: Socket, data: any) {
    const userBlocked = data[0];
    const updateUser = data[1];
    const userID = data[2];

    const newUser = await this.usersService.updateUser(
      userID,
      updateUser,
    );
    const index = this.connectedClients.findIndex((el) => el.userID === userID)
    if (index != -1) {
      const socketIds = this.connectedClients[index].socketID;
      for (const socketId of socketIds) {
        this.server.to(socketId).emit('addUserBlocked', userBlocked);
      }
    }
  }

  @SubscribeMessage('removeUserBlocked')
  async removeUserBlocked(client: Socket, data: any) {
    const userBlocked = data[0];
    const updateUser = data[1];
    const userID = data[2];

    const newUser = await this.usersService.updateUser(
      userID,
      updateUser,
    );
    const index = this.connectedClients.findIndex((el) => el.userID === userID)
    if (index != -1) {
      const socketIds = this.connectedClients[index].socketID;
      for (const socketId of socketIds) {
        this.server.to(socketId).emit('removeUserBlocked', userBlocked);
      }
    }
  }

  @SubscribeMessage('addUserFriend')
  async addUserFriend(client: Socket, data: any) {
    const userFriend = data[0];
    const updateUser = data[1];
    const userID = data[2];

    const newUser = await this.usersService.updateUser(
      userID,
      updateUser,
    );
    const index = this.connectedClients.findIndex((el) => el.userID === userID)
    if (index != -1) {
      const socketIds = this.connectedClients[index].socketID;
      for (const socketId of socketIds) {
        this.server.to(socketId).emit('addUserFriend', userFriend);
      }
    }
  }

  @SubscribeMessage('removeUserFriend')
  async removeUserFriend(client: Socket, data: any) {
    const userFriend = data[0];
    const updateUser = data[1];
    const userID = data[2];

    const newUser = await this.usersService.updateUser(
      userID,
      updateUser,
    );
    const index = this.connectedClients.findIndex((el) => el.userID === userID)
    if (index != -1) {
      const socketIds = this.connectedClients[index].socketID;
      for (const socketId of socketIds) {
        this.server.to(socketId).emit('removeUserFriend', userFriend);
      }
    }
  }

}
