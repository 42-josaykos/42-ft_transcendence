import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MatchesService } from './matches.service';
import { CreateMatchDTO } from './dto/create-match.dto';
import Match from './entities/matches.entity';

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

  @Post()
  async createMatch(@Body() match: CreateMatchDTO): Promise<Match> {
    const newMatch = await this.matchesService.createMatch(match);
    return newMatch;
  }
}
