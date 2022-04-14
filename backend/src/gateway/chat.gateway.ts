import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
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

@WebSocketGateway({
  //donne accès à la fonctionnalité socket.io
  namespace: 'chat',
  cors: {
    origin: 'http://localhost:3001',
    credentials: true,
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  //pour enregistrer certains états clés de notre application. Par exemple, nous enregistrons lorsqu'un nouveau client se connecte au serveur ou lorsqu'un client actuel se déconnecte
  constructor(
    private readonly channelsService: ChannelsService,
    private readonly usersService: UsersService,
    private readonly messagesService: MessagesService,
  ) {}

  @WebSocketServer() server: Server; //donne accès à l'instance du serveur websockets
  private logger: Logger = new Logger('ChatGateway');

  @SubscribeMessage('msgToServer')
  async handleMessage(client: Socket, data: any) {
    const message = data[0];
    const user = data[1];

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
      this.server.to(member.socketID).emit('msgToClient', newMessage);
    }
  }

  @SubscribeMessage('channelToServer')
  async handleChannel(client: Socket, channel: Channel) {
    this.server.emit('channelToClient', channel);
  }

  @SubscribeMessage('deleteChannelToServer')
  async deleteChannel(client: Socket, channelID: number) {
    this.server.emit('deleteChannelToClient', channelID);
  }

  @SubscribeMessage('newOwnerToServer')
  async newOwner(client: Socket, ownerID: number) {
    const [user] = await this.usersService.getUsersByFilter({
      id: ownerID,
      socketID: true,
    });
    this.server.to(user.socketID).emit('newOwnerToClient', ownerID);
  }

  @SubscribeMessage('updateChannelToServer')
  async updateChannel(client: Socket, channel: Channel) {
    this.server.emit('updateChannelToClient', channel);
  }

  @SubscribeMessage('inviteJoinChannelToServer')
  async inviteChannel(client: Socket, data: any[]) {
    const channel = data[0];
    data.splice(0, 1);
    data.forEach(async (el: any) => {
      const user = await this.usersService.getUserByID(el.id);
      this.server.to(user.socketID).emit('inviteJoinChannelToClient', channel);
    });
  }

  @SubscribeMessage('updateMemberChannelToServer')
  async leaveChannel(client: Socket, data: any) {
    const [channel] = await this.channelsService.getChannelsByFilter({
      id: data.id,
      members: true,
    });
    const members = channel.members;

    for (const member of members) {
      this.server
        .to(member.socketID)
        .emit('updateMemberChannelToClient', channel.id);
    }
  }

  async handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);

    //recuperer le cookie
    if (client.handshake.headers['cookie'] != undefined) {
      const cookie = client.handshake.headers['cookie']
        .split('.')[1]
        .substring(8);
      console.log('cookie => ', cookie);

      //recuperer dans la DB la session correspondante
      const sessionRepo = getRepository(TypeORMSession);
      const cookie_json = await sessionRepo.findByIds([cookie]);
      const user = JSON.parse(cookie_json[0].json).passport.user;

      //mettre a jour le socketId du user
      const updateUser: UpdateUserDTO = { socketID: client.id };
      await this.usersService.updateUser(user.id, updateUser);
    }
    // a chaque connexion sur la page /chat un nouvel identifiant socket est créé
    // le stocker dans le user en question pour pouvoir émettre les info vers celui ci si concerné
    // attention checker la déconexion avec le changement de page car crée un nouveau socket sans fermer l'ancien
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
