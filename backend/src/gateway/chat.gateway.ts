import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
  WsResponse,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import User from 'src/api/users/entities/user.entity';
import { ChannelsService } from 'src/api/channels/channels.service';
import { UsersService } from 'src/api/users/users.service';
import { AuthService } from 'src/auth/auth.service';
import { MessagesService } from 'src/api/messages/messages.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { FilterUserDTO } from 'src/api/users/dto/filter-user.dto';
import { UpdateUserDTO } from 'src/api/users/dto/update-user.dto';
import { StatsService } from 'src/api/stats/stats.service';
import Stats from 'src/api/stats/entities/stats.entity';

class Connections {
  userID: number;
  socketID: string[];
}

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: `http://${process.env.HOST}:${process.env.FRONTEND_PORT}`,
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly channelsService: ChannelsService,
    private readonly usersService: UsersService,
    private readonly statsService: StatsService,
    private readonly messagesService: MessagesService,
  ) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');
  private connectedClients: Connections[] = new Array();
  /*
    Connection
  */
  async handleConnection(@ConnectedSocket() client: Socket) {
    // this.logger.log(`Client connected: ${client.id}`);
    this.server.to(client.id).emit('askInfo');
  }

  /*
    Deconnection
  */
  handleDisconnect(@ConnectedSocket() client: Socket) {
    // this.logger.log(`Client disconnected: ${client.id}`);

    const userIndex = this.connectedClients.findIndex(
      (connection) => connection.socketID.indexOf(client.id) !== -1,
    );

    // Should never append, but prevention is better than cure
    if (userIndex === -1) {
      // console.log('Client: ', client);
      // console.log('[Chat] Connected Clients: ', this.connectedClients);
      return;
      // throw new WsException('Disconnecting user was not found');
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
  }

  @SubscribeMessage('logout')
  handleLogout(@ConnectedSocket() client: Socket) {
    // this.logger.log(`Logout: ${client.id}`);
    const userIndex = this.connectedClients.findIndex(
      (connection) => connection.socketID.indexOf(client.id) !== -1,
    );

    // Should never append, but prevention is better than cure
    if (userIndex === -1) {
      // console.log('Client: ', client);
      // console.log('[Chat] Connected Clients: ', this.connectedClients);
      return;
      // throw new WsException('Disconnecting user was not found');
    }

    // console.log(
    //   'User chat sockets: ',
    //   this.connectedClients[userIndex].socketID,
    // );

    // Move to login page, but not needed here, already in StatusSystem
    // this.server.to(this.connectedClients[userIndex].socketID).emit('logout');
    // Disconnect all sockets
    this.server
      .to(this.connectedClients[userIndex].socketID)
      .disconnectSockets(true);
    // Delete user and it's sockets from connectedClients
    this.connectedClients.splice(userIndex, 1);
  }

  @SubscribeMessage('sendInfo')
  async sendInfo(@ConnectedSocket() client: Socket, @MessageBody() data: User) {
    const userIndex = this.connectedClients.findIndex(
      (connection) => connection.userID === data.id,
    );
    if (userIndex === -1) {
      this.connectedClients.push({ userID: data.id, socketID: [client.id] });
    } else {
      this.connectedClients[userIndex].socketID.push(client.id);
    }
    this.server.emit(
      'receiveFilteredUsers',
      await this.usersService.getUsersByFilter({}),
    );
    // console.log('Clients connected after connect: ', this.connectedClients);
  }

  /*
    New message
  */
  @SubscribeMessage('newMessage')
  async newMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    const message = data[0];
    const user = data[1];
    try {
      let channel = message.channel;
      [channel] = await this.channelsService.getChannelsByFilter({
        id: channel.id,
        members: true,
        mutes: false,
        bans: false,
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
        const index = this.connectedClients.findIndex(
          (el) => el.userID === member.id,
        );
        if (index != -1) {
          const socketIds = this.connectedClients[index].socketID;
          for (const socketId of socketIds) {
            this.server.to(socketId).emit('newMessage', newMessage);
          }
        }
      }
    } catch (error) {
      this.server.to(client.id).emit('error', { message: error.message });
    }
  }

  /*
    New Channel
  */
  @SubscribeMessage('newChannel')
  async newChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    const channel = data[0];
    const message = data[1];
    const userID = data[2];

    try {
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
        owner: false,
      });

      const [user] = await this.usersService.getUsersByFilter({
        id: userID.id,
      });
      this.server.emit('newChannel', { newChannel, message, user });
    } catch (error) {
      this.server.to(client.id).emit('error', { message: error.message });
    }
  }

  /*

    Join Channel
  */
  @SubscribeMessage('joinChannel')
  async joinChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    const userID = data[0];
    const channel = data[1];
    const password = data[2];
    try {
      if (channel.isProtected) {
        if (password) {
          const [channelItem] = await this.channelsService.getChannelsByFilter({
            id: channel.id,
            password: true,
          });

          const isPasswordMatching = await bcrypt.compare(
            password,
            channelItem.password,
          );
          if (!isPasswordMatching) {
            this.server.to(client.id).emit('error', {
              message: 'Channel protected by a password => wrong password',
            });
            return;
          }
        } else {
          this.server.to(client.id).emit('error', {
            message: 'Channel protected by a password => wrong password',
          });
          return;
        }
      }

      const index = this.connectedClients.findIndex(
        (el) => el.userID === userID,
      );
      if (index != -1) {
        const socketIds = this.connectedClients[index].socketID;
        let [channelJoin] = await this.channelsService.getChannelsByFilter({
          id: channel.id,
          admins: true,
        });
        for (const socketId of socketIds) {
          this.server.to(socketId).emit('joinChannel', channelJoin);
        }
      }
    } catch (error) {
      this.server.to(client.id).emit('error', { message: error.message });
    }
  }

  /*
    Delete Channel
  */
  @SubscribeMessage('deleteChannel')
  async deleteChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() channelID: number,
  ) {
    try {
      let [channel] = await this.channelsService.getChannelsByFilter({
        id: channelID,
        invites: true,
      });

      if (channel.invites != []) {
        for (const invite of channel.invites) {
          const index = this.connectedClients.findIndex(
            (el) => el.userID === invite.id,
          );
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
    } catch (error) {
      this.server.to(client.id).emit('error', { message: error.message });
    }
  }

  /*
    Invite Channel
  */
  @SubscribeMessage('inviteChannel')
  async inviteChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any[],
  ) {
    if (data[1] != null) {
      const channel = data[0];
      const invites = data[1];

      for (const invite of invites) {
        const index = this.connectedClients.findIndex(
          (el) => el.userID === invite.id,
        );
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
  async updateInvite(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any[],
  ) {
    if (data[1] != null) {
      const inviteChannel = data[0];
      const inviteBool = data[1];
      const userID = data[2];

      const index = this.connectedClients.findIndex(
        (el) => el.userID === userID,
      );
      if (index != -1) {
        const socketIds = this.connectedClients[index].socketID;
        for (const socketId of socketIds) {
          this.server
            .to(socketId)
            .emit('updateInvite', { inviteChannel, inviteBool });
        }
      }
    }
  }

  /*
    Update Member Channel
  */
  @SubscribeMessage('updateMember')
  async updateMember(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    const channelID = data[0];
    const updateChannel = data[1];
    const message = data[2];
    const user = data[3];

    try {
      let userMember: User = undefined;
      if (updateChannel.removeMembers != undefined) {
        userMember = updateChannel.removeMembers[0];
      }
      let userAddBan: User = undefined;
      if (updateChannel.addBans != undefined) {
        userAddBan = updateChannel.addBans[0].user;
      }
      let userRemoveBan: User = undefined;
      if (updateChannel.removeBans != undefined) {
        userRemoveBan = updateChannel.removeBans[0].user;
      }
      let userAddMute: User = undefined;
      if (updateChannel.addMutes != undefined) {
        userAddMute = updateChannel.addMutes[0].user;
      }
      let userRemoveMute: User = undefined;
      if (updateChannel.removeMutes != undefined) {
        userRemoveMute = updateChannel.removeMutes[0].user;
      }

      const newChannel = await this.channelsService.updateChannel(
        channelID,
        updateChannel,
      );

      let [channel] = await this.channelsService.getChannelsByFilter({
        id: channelID,
        members: true,
      });

      const members = channel.members;
      for (const member of members) {
        const index = this.connectedClients.findIndex(
          (el) => el.userID === member.id,
        );
        if (index != -1) {
          const socketIds = this.connectedClients[index].socketID;
          for (const socketId of socketIds) {
            this.server.to(socketId).emit('updateMember', newChannel);
            if (
              userAddBan != undefined &&
              this.connectedClients[index].userID == userAddBan.id
            ) {
              this.server.to(socketId).emit('userAddBan', newChannel);
            }
            if (
              userRemoveBan != undefined &&
              this.connectedClients[index].userID == userRemoveBan.id
            ) {
              this.server.to(socketId).emit('userRemoveBan', newChannel);
            }
            if (
              userAddMute != undefined &&
              this.connectedClients[index].userID == userAddMute.id
            ) {
              this.server.to(socketId).emit('userAddMute', newChannel);
            }
            if (
              userRemoveMute != undefined &&
              this.connectedClients[index].userID == userRemoveMute.id
            ) {
              this.server.to(socketId).emit('userRemoveMute', newChannel);
            }
          }
        }
      }

      if (userMember != undefined) {
        const index = this.connectedClients.findIndex(
          (el) => el.userID === userMember.id,
        );
        if (index != -1) {
          if (
            userMember != undefined &&
            this.connectedClients[index].userID == userMember.id
          ) {
            const socketIds = this.connectedClients[index].socketID;
            for (const socketId of socketIds) {
              this.server.to(socketId).emit('userRemoveMember', newChannel);
            }
          }
        }
      }

      if (message != null) {
        this.newMessage(client, [message, user]);
      }
    } catch (error) {
      this.server.to(client.id).emit('error', { message: error.message });
    }
  }

  /*
    Update Channel
  */
  @SubscribeMessage('updateChannel')
  async updateChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    const channelID = data[0];
    const updateChannel = data[1];
    try {
      const newChannel = await this.channelsService.updateChannel(
        channelID,
        updateChannel,
      );

      if (updateChannel.removeInvites != []) {
        for (const invite of updateChannel.removeInvites) {
          const index = this.connectedClients.findIndex(
            (el) => el.userID === invite.id,
          );
          if (index != -1) {
            const socketIds = this.connectedClients[index].socketID;
            for (const socketId of socketIds) {
              this.server.to(socketId).emit('uninviteChannel', updateChannel);
            }
          }
        }
      }

      this.server.emit('updateMember', newChannel);
    } catch (error) {
      this.server.to(client.id).emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('addUserBlocked')
  async addUserBlocked(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    const userBlocked = data[0];
    const updateUser = data[1];
    const userID = data[2];

    try {
      const newUser = await this.usersService.updateUser(userID, updateUser);
      const index = this.connectedClients.findIndex(
        (el) => el.userID === userID,
      );
      if (index != -1) {
        const socketIds = this.connectedClients[index].socketID;
        for (const socketId of socketIds) {
          this.server.to(socketId).emit('addUserBlocked', userBlocked);
        }
      }
    } catch (error) {
      this.server.to(client.id).emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('removeUserBlocked')
  async removeUserBlocked(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    const userBlocked = data[0];
    const updateUser = data[1];
    const userID = data[2];

    try {
      const newUser = await this.usersService.updateUser(userID, updateUser);
      const index = this.connectedClients.findIndex(
        (el) => el.userID === userID,
      );
      if (index != -1) {
        const socketIds = this.connectedClients[index].socketID;
        for (const socketId of socketIds) {
          this.server.to(socketId).emit('removeUserBlocked', userBlocked);
        }
      }
    } catch (error) {
      this.server.to(client.id).emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('addUserFriend')
  async addUserFriend(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    const userFriend = data[0];
    const updateUser = data[1];
    const userID = data[2];

    try {
      const newUser = await this.usersService.updateUser(userID, updateUser);
      const index = this.connectedClients.findIndex(
        (el) => el.userID === userID,
      );
      if (index != -1) {
        const socketIds = this.connectedClients[index].socketID;
        for (const socketId of socketIds) {
          this.server.to(socketId).emit('addUserFriend', userFriend);
        }
      }
    } catch (error) {
      this.server.to(client.id).emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('removeUserFriend')
  async removeUserFriend(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    const userFriend = data[0];
    const updateUser = data[1];
    const userID = data[2];

    try {
      const newUser = await this.usersService.updateUser(userID, updateUser);
      const index = this.connectedClients.findIndex(
        (el) => el.userID === userID,
      );
      if (index != -1) {
        const socketIds = this.connectedClients[index].socketID;
        for (const socketId of socketIds) {
          this.server.to(socketId).emit('removeUserFriend', userFriend);
        }
      }
    } catch (error) {
      this.server.to(client.id).emit('error', { message: error.message });
    }
  }

  // Access to the API
  @SubscribeMessage('getUsersByFilter')
  async getAllUsers(
    @ConnectedSocket() client: Socket,
    @MessageBody() filter: FilterUserDTO,
  ) {
    this.server
      .to(client.id)
      .emit(
        'receiveFilteredUsers',
        await this.usersService.getUsersByFilter(filter),
      );
  }

  @SubscribeMessage('getUserFriends')
  async getUserFriends(
    @ConnectedSocket() client: Socket,
    @MessageBody() loggedUser: User,
  ) {
    this.server
      .to(client.id)
      .emit(
        'receiveFriends',
        (await this.usersService.getUserByID(loggedUser.id, ['friends']))
          .friends,
      );
  }

  @SubscribeMessage('updateFriends')
  async removeFriend(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    this.server
      .to(client.id)
      .emit(
        'receiveFriends',
        (await this.usersService.updateUser(data.id, data.updateDTO)).friends,
      );
  }

  @SubscribeMessage('getStats')
  async getStats(@ConnectedSocket() client: Socket) {
    this.server
      .to(client.id)
      .emit('receiveStatsUpdate', await this.statsService.getAllStats());
  }
}
