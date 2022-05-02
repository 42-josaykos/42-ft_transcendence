import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { StatusGateway } from 'src/status/status.gateway';

@Module({
  controllers: [GameController],
  providers: [GameGateway, GameService, StatusGateway],
})
export class GameModule {}
