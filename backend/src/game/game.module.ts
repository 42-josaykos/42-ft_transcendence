import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { StatusGateway } from 'src/status/status.gateway';

@Module({
  providers: [GameGateway, GameService],
})
export class GameModule {}
