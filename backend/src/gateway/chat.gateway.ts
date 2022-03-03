import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from 'socket.io';

@WebSocketGateway({
    cors: {
      origin: '*',
    },
  }) // peut prendre en parametre un numero de port sur lequel la passerelle doit s'executer dans le cas ou le port doit etre different du port sur lequel le serveur s'execute(3000 par default) 
export class ChatGateway {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('message')
    async handleMessage(@MessageBody() message: string): Promise<void> {
        console.log("backend message => ", message);
        this.server.emit('message', message)
    }
}