import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MatchesService } from './matches.service';
import { CreateMatchDTO } from './dto/create-match.dto';
import Match from './entities/matches.entity';
import User from '../users/entities/user.entity';
import { UpdateMatchDTO } from './dto/update-match.dto';
import { FilterMatchDTO } from './dto/filter-match.dto';
import { JwtAccessGuard } from 'src/auth/guards';

@Controller('matches')
@UseGuards(JwtAccessGuard)
@ApiTags('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get()
  async getAllMatches(): Promise<Match[]> {
    return await this.matchesService.getAllMatches();
  }

  @Get('search')
  async getMatchesByFilter(@Query() filter: FilterMatchDTO): Promise<Match[]> {
    return await this.matchesService.getMatchesByFilter(filter);
  }

  @Get(':matchID')
  async getMatchByID(
    @Param('matchID', ParseIntPipe) matchID: number,
  ): Promise<Match> {
    return await this.matchesService.getMatchByID(matchID);
  }

  @Get(':matchID/playerOne')
  async getMatchPlayerOne(
    @Param('matchID', ParseIntPipe) matchID: number,
  ): Promise<User> {
    return await this.matchesService.getMatchPlayerOne(matchID);
  }

  @Get(':matchID/playerTwo')
  async getMatchPlayerTwo(
    @Param('matchID', ParseIntPipe) matchID: number,
  ): Promise<User> {
    return await this.matchesService.getMatchPlayerTwo(matchID);
  }

  @Get(':matchID/score')
  async getMatchScore(
    @Param('matchID', ParseIntPipe) matchID: number,
  ): Promise<number[]> {
    return await this.matchesService.getMatchScore(matchID);
  }

  @Get(':matchID/scorePlayerOne')
  async getMatchScorePlayerOne(
    @Param('matchID', ParseIntPipe) matchID: number,
  ): Promise<number> {
    return await this.matchesService.getMatchScorePlayerOne(matchID);
  }

  @Get(':matchID/scorePlayerTwo')
  async getMatchScorePlayerTwo(
    @Param('matchID', ParseIntPipe) matchID: number,
  ): Promise<number> {
    return await this.matchesService.getMatchScorePlayerTwo(matchID);
  }

  @Get(':matchID/winner')
  async getMatchWinner(
    @Param('matchID', ParseIntPipe) matchID: number,
  ): Promise<User> {
    return await this.matchesService.getMatchWinner(matchID);
  }

  @Patch(':matchID')
  async updateMatch(
    @Param('matchID', ParseIntPipe) matchID: number,
    @Body() updatedMatch: UpdateMatchDTO,
  ): Promise<Match> {
    return await this.matchesService.updateMatch(matchID, updatedMatch);
  }

  @Delete(':matchID')
  async deleteMatch(
    @Param('matchID', ParseIntPipe) matchID: number,
  ): Promise<void> {
    return await this.matchesService.deleteMatch(matchID);
  }
}

@Controller('matches')
@ApiTags('matches')
export class PostMatchesController {
  constructor(private readonly matchesService: MatchesService) {}
  @Post()
  async createMatch(@Body() match: CreateMatchDTO): Promise<Match> {
    return await this.matchesService.createMatch(match);
  }
}
