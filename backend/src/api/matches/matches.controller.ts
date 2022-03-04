import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MatchesService } from './matches.service';
import { CreateMatchDTO } from './dto/create-match.dto';
import Match from './entities/matches.entity';
import User from '../users/entities/user.entity';
import { UpdateMatchDTO } from './dto/update-match.dto';

@Controller('matches')
@ApiTags('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get()
  async getAllMatches(): Promise<Match[]> {
    return await this.matchesService.getAllMatches();
  }

  @Get(':id')
  async getMatchByID(
    @Param('id', ParseIntPipe) matchID: number,
  ): Promise<Match> {
    return await this.matchesService.getMatchByID(matchID);
  }

  @Get(':id/playerOne')
  async getMatchPlayerOne(
    @Param('id', ParseIntPipe) matchID: number,
  ): Promise<User> {
    return await this.matchesService.getMatchPlayerOne(matchID);
  }

  @Get(':id/playerTwo')
  async getMatchPlayerTwo(
    @Param('id', ParseIntPipe) matchID: number,
  ): Promise<User> {
    return await this.matchesService.getMatchPlayerTwo(matchID);
  }

  @Get(':id/score')
  async getMatchScore(
    @Param('id', ParseIntPipe) matchID: number,
  ): Promise<number[]> {
    return await this.matchesService.getMatchScore(matchID);
  }

  @Get(':id/scorePlayerOne')
  async getMatchScorePlayerOne(
    @Param('id', ParseIntPipe) matchID: number,
  ): Promise<number> {
    return await this.matchesService.getMatchScorePlayerOne(matchID);
  }

  @Get(':id/scorePlayerTwo')
  async getMatchScorePlayerTwo(
    @Param('id', ParseIntPipe) matchID: number,
  ): Promise<number> {
    return await this.matchesService.getMatchScorePlayerTwo(matchID);
  }

  @Get(':id/winner')
  async getMatchWinner(
    @Param('id', ParseIntPipe) matchID: number,
  ): Promise<User> {
    return await this.matchesService.getMatchWinner(matchID);
  }

  @Post()
  async createMatch(@Body() match: CreateMatchDTO): Promise<Match> {
    return await this.matchesService.createMatch(match);
  }

  @Patch(':id')
  async updateMatch(
    @Param('id', ParseIntPipe) matchID: number,
    @Body() updatedMatch: UpdateMatchDTO,
  ): Promise<Match> {
    return await this.matchesService.updateMatch(matchID, updatedMatch);
  }

  @Delete(':id')
  async deleteMatch(@Param('id', ParseIntPipe) matchID: number): Promise<void> {
    return await this.matchesService.deleteMatch(matchID);
  }
}
