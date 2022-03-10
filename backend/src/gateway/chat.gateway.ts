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
 
 @WebSocketGateway({  //donne accès à la fonctionnalité socket.io
   cors: {
     origin: '*',
   },
 })
 export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect { //pour enregistrer certains états clés de notre application. Par exemple, nous enregistrons lorsqu'un nouveau client se connecte au serveur ou lorsqu'un client actuel se déconnecte

  @WebSocketServer() server: Server; //donne accès à l'instance du serveur websockets
  private logger: Logger = new Logger('ChatGateway');

  @SubscribeMessage('createConnection')
  handleCreateConnection(client: Socket, user: User): void {
   this.logger.log(`Client arg: ${user.username}`);
  }

  @SubscribeMessage('msgToServer') // permet d'écouter l'évènement "msgToServer"
  handleMessage(client: Socket, message: Message): void {
   //const channel = message.channel;
   //const members = this.channelsService.getChannelMembers(channel.id);
   this.server.emit('msgToClient', message); // on envoit les données à tous les clients connectés au serveur
  }
 
  afterInit(server: Server) {
   this.logger.log('Init');
  }
 
  handleDisconnect(client: Socket) {
   this.logger.log(`Client disconnected: ${client.id}`);
  }
 
  handleConnection(client: Socket, ...args: any[]) {
   this.logger.log(`Client connected: ${client.id}`);
   // a chaque connexion sur la page /chat un nouvel identifiant socket est créé
   // le stocker dans le user en question pour pouvoir émettre les info vers celui ci si concerné
   // attention checker la déconexion avec le changement de page car crée un nouveau socket sans fermer l'ancien



  }
 }