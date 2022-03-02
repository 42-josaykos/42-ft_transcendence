import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MatchesService } from './matches.service';

@Controller('matches')
@ApiTags('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get()
  async getAllMatches() {
    const matches = this.matchesService.getAllMatches();
    return matches;
  }

  @Get(':id')
  async getMatchByID(@Param('id', ParseIntPipe) matchID: number) {
    const match = this.matchesService.getMatchByID(matchID);
    return match;
  }
}
