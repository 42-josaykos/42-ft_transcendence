import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Match from './entities/matches.entity';
import User from '../users/entities/user.entity';
import { CreateMatchDTO } from './dto/create-match.dto';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private readonly matchesRepository: Repository<Match>,
  ) {}

  // Basic GET routes
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
      return match.score;
    } catch (error) {
      throw error;
    }
  }

  async createMatch(match: CreateMatchDTO): Promise<Match> {
    const newMatch = this.matchesRepository.create(match);
    await this.matchesRepository.save(newMatch);
    return newMatch;
  }
}
