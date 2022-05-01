import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { Game } from 'src/game/game.class';
import { Connection } from 'src/game/game.class';
import { Player } from 'src/game/game.class';
import { Spectator } from 'src/game/game.class';
import { Ball } from 'src/game/game.class';

@Module({
  // imports: [Game, Connection, Player, Spectator, Ball],
  providers: [GameGateway, GameService],
})
export class GameModule {}
