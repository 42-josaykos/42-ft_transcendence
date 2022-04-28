import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { MatchesService } from 'src/api/matches/matches.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/api/users/entities/user.entity';
import Match from 'src/api/matches/entities/matches.entity';
import { MatchesModule } from 'src/api/matches/matches.module';

@Module({
  providers: [GameGateway, GameService],
})
export class GameModule {}
