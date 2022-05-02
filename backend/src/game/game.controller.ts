import { Body, Controller, Post } from '@nestjs/common';
import { Connection } from 'src/status/status.class';
import { GameGateway } from './game.gateway';

@Controller('status')
export class GameController {
  constructor(private gameGateway: GameGateway) {}

  // Just a read-only alias from StatusSystem
  @Post()
  updateConnectedClients(@Body() connectedClients: Connection[]) {
    this.gameGateway.connectedClients = connectedClients;
  }
}
