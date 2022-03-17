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
import Message from '../api/messages/entities/message.entity';
import User from 'src/api/users/entities/user.entity';
import Channel from 'src/api/channels/entities/channel.entity';
import { ChannelsService } from 'src/api/channels/channels.service';
import { UsersService } from 'src/api/users/users.service';
import { UpdateUserDTO } from 'src/api/users/dto/update-user.dto';

@WebSocketGateway({
  //donne accès à la fonctionnalité socket.io
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  //pour enregistrer certains états clés de notre application. Par exemple, nous enregistrons lorsqu'un nouveau client se connecte au serveur ou lorsqu'un client actuel se déconnecte
  constructor(
    private readonly channelsService: ChannelsService,
    private readonly usersService: UsersService,
  ) {}

  @WebSocketServer() server: Server; //donne accès à l'instance du serveur websockets
  private logger: Logger = new Logger('ChatGateway');

  @SubscribeMessage('createConnection')
  async handleCreateConnection(client: Socket, user: User): Promise<void> {
    this.logger.log(`Client arg: ${user.username}`);
    this.logger.log(`Client arg: ${client.data.user}`);
    this.logger.log(`Client id: ${client.id}`);
    const { username, studentID, avatar } = user;
    const updateUser: UpdateUserDTO = {
      username: username,
      avatar: avatar,
      socketID: client.id,
    };
    await this.usersService.updateUser(user.id, updateUser);

    console.log('User => ', user);
  }

  @SubscribeMessage('msgToServer') // permet d'écouter l'évènement "msgToServer"
  async handleMessage(client: Socket, message: Message) {
    const channel = message.channel;
    const members = await this.channelsService.getChannelMembers(channel.id);
    for (const member of members)
      this.server.to(member.socketID).emit('msgToClient', message);
  }

  @SubscribeMessage('channelToServer') // permet d'écouter l'évènement "msgToServer"
  async handleChannel(client: Socket, channel: Channel) {
    this.server.emit('channelToClient', channel); // on envoit les données à tous les clients connectés au serveur
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);

    // a chaque connexion sur la page /chat un nouvel identifiant socket est créé
    // le stocker dans le user en question pour pouvoir émettre les info vers celui ci si concerné
    // attention checker la déconexion avec le changement de page car crée un nouveau socket sans fermer l'ancien
  }
}
