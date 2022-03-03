import { Module } from '@nestjs/common';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import Match from './entities/matches.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Match])],
  controllers: [MatchesController],
  providers: [MatchesService],
})
export class MatchesModule {}
