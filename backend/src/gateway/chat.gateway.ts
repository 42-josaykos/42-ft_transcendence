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
 import Channel from 'src/api/channels/entities/channel.entity';
import { ChannelsService } from 'src/api/channels/channels.service';
import { UsersService } from 'src/api/users/users.service';
import { UpdateUserDTO } from 'src/api/users/dto/update-user.dto';
import { getRepository } from 'typeorm';
import { TypeORMSession } from 'src/auth/entities/session.entity';
 
 @WebSocketGateway({  //donne accès à la fonctionnalité socket.io
   cors: {
     origin: 'http://localhost:3001',
     credentials: true
   },
 })
 export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect { //pour enregistrer certains états clés de notre application. Par exemple, nous enregistrons lorsqu'un nouveau client se connecte au serveur ou lorsqu'un client actuel se déconnecte
  constructor(private readonly channelsService: ChannelsService,
              private readonly usersService: UsersService) {}

  @WebSocketServer() server: Server; //donne accès à l'instance du serveur websockets
  private logger: Logger = new Logger('ChatGateway');

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

  @SubscribeMessage('deleteChannelToServer') // permet d'écouter l'évènement "msgToServer"
  async deleteChannel(client: Socket, channelID: number) {
    this.server.emit('deleteChannelToClient', channelID); // on envoit les données à tous les clients connectés au serveur
  }

  @SubscribeMessage('newOwnerToServer') // permet d'écouter l'évènement "msgToServer"
  async newOwner(client: Socket, ownerID: number) {
    const user = await this.usersService.getUserByID(ownerID);
    this.server.to(user.socketID).emit('newOwnerToClient', ownerID);
  }

  @SubscribeMessage('updateChannelToServer') // permet d'écouter l'évènement "msgToServer"
  async updateChannel(client: Socket, channel: Channel) {
    this.server.emit('updateChannelToClient', channel); // on envoit les données à tous les clients connectés au serveur
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
 
  async handleConnection(client: Socket) {
   this.logger.log(`Client connected: ${client.id}`);

   //recuperer le cookie
   let cookie = client.handshake.headers['cookie'].split('.')[1].substring(8)
   console.log("cookie => ", cookie)

   //recuperer dans la DB la session correspondante
   const sessionRepo = getRepository(TypeORMSession);
   const cookie_json = await sessionRepo.findByIds([cookie]);
   const user = JSON.parse(cookie_json[0].json).passport.user;

   //mettre a jour le socketId du user
   const updateUser: UpdateUserDTO = {socketID: client.id}
   await this.usersService.updateUser(user.id, updateUser)

   // a chaque connexion sur la page /chat un nouvel identifiant socket est créé
   // le stocker dans le user en question pour pouvoir émettre les info vers celui ci si concerné
   // attention checker la déconexion avec le changement de page car crée un nouveau socket sans fermer l'ancien
  }
}
