import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import Channel from 'src/api/channels/entities/channel.entity';
import User from 'src/api/users/entities/user.entity';
import { ChannelsService } from 'src/api/channels/channels.service';
import { UsersService } from 'src/api/users/users.service';
import { UpdateUserDTO } from 'src/api/users/dto/update-user.dto';
import { getRepository } from 'typeorm';
import { TypeORMSession } from 'src/auth/entities/session.entity';
import { MessagesService } from 'src/api/messages/messages.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
 
 @WebSocketGateway({  //donne accès à la fonctionnalité socket.io
   cors: {
     origin: 'http://localhost:3001',
     credentials: true
   },
 })
 export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect { //pour enregistrer certains états clés de notre application. Par exemple, nous enregistrons lorsqu'un nouveau client se connecte au serveur ou lorsqu'un client actuel se déconnecte
  constructor(private readonly channelsService: ChannelsService,
              private readonly usersService: UsersService,
              private readonly messagesService: MessagesService,
              private readonly jwtService: JwtService) {}

  @WebSocketServer() server: Server; //donne accès à l'instance du serveur websockets
  private logger: Logger = new Logger('ChatGateway');


  /*
    Connection
  */
  async handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);

    if (client.handshake.headers['cookie'] != undefined) {
      const str = client.handshake.headers['cookie'];
      let cookie = str.substring(str.indexOf("=") + 1, str.indexOf(";"))

      const decodeJwtAccessToken = this.jwtService.decode(cookie)
      const userId = decodeJwtAccessToken['userId']

      const updateUser: UpdateUserDTO = {socketID: client.id}
      await this.usersService.updateUser(userId, updateUser)
    }
  }


  /*
    Deconnection
  */
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }


  /*
    New message
  */
  @SubscribeMessage('newMessage')
  async newMessage(client: Socket, data: any) {

    const message = data[0]
    const user = data[1]

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
      usersMuted.findIndex((el: User) => el.id == user.id) != -1 ||
      usersBaned.findIndex((el: User) => el.id == user.id) != -1
    ) {
      return;
    }

    const newMessage = await this.messagesService.createMessage(message);
    newMessage.author = user;

    for (const member of members) {
      this.server.to(member.socketID).emit('newMessage', newMessage);
    }
  }


  /*
    New Channel
  */
  @SubscribeMessage('newChannel')
  async newChannel(client: Socket, data: any) {
    const channel = data[0]
    const message = data[1]
    const userID = data[2]

    const newChannel = await this.channelsService.createChannel(channel)
    if (message != null) {
      message.channel.id = newChannel.id
    }

    const [user] = await this.usersService.getUsersByFilter({
      id: userID.id,
    });
    this.server.emit('newChannel', {newChannel, message, user});
  }

  /*

    Join Channel
  */
  @SubscribeMessage('joinChannel')
  async joinChannel(client: Socket, data: any) {
    const userID = data[0]
    const channel = data[1];
    const password = data[2]

    if (channel.password) {
      if (password) {
        const isPasswordMatching = await bcrypt.compare(
          password,
          channel.password,
        );
        if (!isPasswordMatching) {
          console.log("Password false")
          return;
        }
      }
      else {
        console.log("Password false")
        return;
      }
    }
    const [user] = await this.usersService.getUsersByFilter({
      id: userID,
      socketID: true,
    });
    this.server.to(user.socketID).emit('joinChannel');
  }


  /*
    Delete Channel
  */
  @SubscribeMessage('deleteChannel')
  async deleteChannel(client: Socket, channelID: number) {
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

      invites.forEach(async (el: any) => {
        const user = await this.usersService.getUserByID(el.id);
        this.server.to(user.socketID).emit('inviteChannel', channel);
      })
    }
  }


  /*
    Update Member Channel
  */
  @SubscribeMessage('updateMember')
  async updateMember(client: Socket, data: any) {
    const channelID = data[0]
    const updateChannel = data[1]
    const message = data[2]
    const user = data[3]
    const newChannel = await this.channelsService.updateChannel(channelID, updateChannel);
    let [channel] = await this.channelsService.getChannelsByFilter({
      id: channelID,
      members: true,
    });
    const members = channel.members;
    for (const member of members) {
      this.server.to(member.socketID).emit('updateMember', newChannel);
    }
    if (message != null) {
      this.newMessage(client, [message, user])
    }
  }


  /*
    Update Channel
  */
    @SubscribeMessage('updateChannel')
    async updateChannel2(client: Socket, data: any) {
      const channelID = data[0]
      const updateChannel = data[1]
      const newChannel = await this.channelsService.updateChannel(channelID, updateChannel);
      this.server.emit('updateMember', newChannel);
    }
}