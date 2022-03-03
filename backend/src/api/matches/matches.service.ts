import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Match from './entities/matches.entity';
import User from '../users/entities/user.entity';
import { CreateMatchDTO } from './dto/create-match.dto';
import { UpdateMatchDTO } from './dto/update-match.dto';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private readonly matchesRepository: Repository<Match>,
  ) {}

  async getAllMatches(): Promise<Match[]> {
    const matches = await this.matchesRepository.find({
      order: { id: 'DESC' },
      relations: ['playerOne', 'playerTwo', 'winner'],
    });
    return matches;
  }

  async getMatchByID(matchID: number): Promise<Match> {
    const match = await this.matchesRepository.findOne({
      where: { id: matchID },
      relations: ['playerOne', 'playerTwo', 'winner'],
    });
    if (!match) throw new NotFoundException('Match not found (id not correct)');
    return match;
  }

  async getMatchPlayerOne(matchID: number): Promise<User> {
    try {
      const match = await this.getMatchByID(matchID);
      return match.playerOne;
    } catch (error) {
      throw error;
    }
  }

  async getMatchPlayerTwo(matchID: number): Promise<User> {
    try {
      const match = await this.getMatchByID(matchID);
      return match.playerTwo;
    } catch (error) {
      throw error;
    }
  }

  async getMatchWinner(matchID: number): Promise<User> {
    try {
      const match = await this.getMatchByID(matchID);
      return match.winner;
    } catch (error) {
      throw error;
    }
  }

  async getMatchScore(matchID: number): Promise<number[]> {
    try {
      const match = await this.getMatchByID(matchID);
      return [match.scorePlayerOne, match.scorePlayerTwo];
    } catch (error) {
      throw error;
    }
  }

  async getMatchScorePlayerOne(matchID: number): Promise<number> {
    try {
      const match = await this.getMatchByID(matchID);
      return match.scorePlayerOne;
    } catch (error) {
      throw error;
    }
  }

  async getMatchScorePlayerTwo(matchID: number): Promise<number> {
    try {
      const match = await this.getMatchByID(matchID);
      return match.scorePlayerTwo;
    } catch (error) {
      throw error;
    }
  }

  async createMatch(match: CreateMatchDTO): Promise<Match> {
    const newMatch = this.matchesRepository.create(match);

    // Deciding winner if no 'winner' key in body
    if (!newMatch.winner) {
      if (newMatch.scorePlayerOne > newMatch.scorePlayerTwo)
        newMatch.winner = newMatch.playerOne;
      else newMatch.winner = newMatch.playerTwo;
    }

    await this.matchesRepository.save(newMatch);
    return newMatch;
  }

  async updateMatch(
    matchID: number,
    updatedMatch: UpdateMatchDTO,
  ): Promise<Match> {
    const match = await this.matchesRepository.findOne({
      where: { id: matchID },
    });
    if (!match) throw new NotFoundException('Match not found (id incorrect)');
    else {
      await this.matchesRepository.update(matchID, updatedMatch);
      return await this.getMatchByID(matchID);
    }
  }

  async deleteMatch(matchID: number): Promise<void> {
    const match = await this.matchesRepository.findOne({
      where: { id: matchID },
    });
    if (!match) throw new NotFoundException('Match not found (id incorrect)');
    else await this.matchesRepository.delete(match);
  }
}
