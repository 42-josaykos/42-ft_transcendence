import { Module } from '@nestjs/common';
import { MatchesController, PostMatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import Match from './entities/matches.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from '../users/entities/user.entity';
import Stats from '../stats/entities/stats.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Match, Stats])],
  controllers: [MatchesController, PostMatchesController],
  providers: [MatchesService],
  exports: [MatchesService],
})
export class MatchesModule {}
