import { Module } from '@nestjs/common';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import Match from './entities/matches.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import User from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Match])],
  controllers: [MatchesController],
  providers: [MatchesService],
})
export class MatchesModule {}
