import { Module } from '@nestjs/common';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import Match from './entities/matches.entity';

@Module({
  imports: [Match],
  exports: [Match],
  controllers: [MatchesController],
  providers: [MatchesService],
})
export class MatchesModule {}
