import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { getRepository, Repository } from 'typeorm';
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
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async getAllMatches(): Promise<Match[]> {
    const matches = await this.matchesRepository.find({
      order: { id: 'DESC' },
      relations: ['players', 'winner'],
    });
    return matches;
  }

  async getMatchByID(matchID: number): Promise<Match> {
    const match = await this.matchesRepository.findOne({
      where: { id: matchID },
      relations: ['players', 'winner'],
    });
    if (!match) throw new NotFoundException('Match not found (id not correct)');
    return match;
  }

  async getMatchPlayerOne(matchID: number): Promise<User> {
    try {
      const match = await this.getMatchByID(matchID);
      return match.players[0];
    } catch (error) {
      throw error;
    }
  }

  async getMatchPlayerTwo(matchID: number): Promise<User> {
    try {
      const match = await this.getMatchByID(matchID);
      return match.players[1];
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

  async getMatchScorePlayerOne(matchID: number): Promise<number> {
    try {
      const match = await this.getMatchByID(matchID);
      return match.score[0];
    } catch (error) {
      throw error;
    }
  }

  async getMatchScorePlayerTwo(matchID: number): Promise<number> {
    try {
      const match = await this.getMatchByID(matchID);
      return match.score[1];
    } catch (error) {
      throw error;
    }
  }

  async createMatch(match: CreateMatchDTO): Promise<Match> {
    if ((await this.usersRepository.count(match.players[0])) === 0)
      throw new ForbiddenException(
        "Can't create match (playerOne does not exists)",
      );
    if ((await this.usersRepository.count(match.players[1])) === 0)
      throw new ForbiddenException(
        "Can't create match (playerTwo does not exists)",
      );
    const newMatch = this.matchesRepository.create(match);

    // Deciding winner if no 'winner' key in body
    if (!newMatch.winner) {
      if (newMatch.score[0] > newMatch.score[1])
        newMatch.winner = newMatch.players[0];
      else newMatch.winner = newMatch.players[1];
    }

    await this.matchesRepository.save(newMatch);
    return this.getMatchByID(newMatch.id);
  }

  async updateMatch(
    matchID: number,
    updatedMatch: UpdateMatchDTO,
  ): Promise<Match> {
    try {
      const match = await this.getMatchByID(matchID);
      //Checking what is updated
      if (updatedMatch.players) {
        if ((await this.usersRepository.count(updatedMatch.players[0])) == 0)
          throw new ForbiddenException(
            "Can't update match (playerOne does not exists)",
          );
        else if (
          (await this.usersRepository.count(updatedMatch.players[1])) == 0
        )
          throw new ForbiddenException(
            "Can't update match (playerTwo does not exists)",
          );
        else match.players = updatedMatch.players;
      }
      if (updatedMatch.score) match.score = updatedMatch.score;
      if (updatedMatch.winner) {
        if ((await this.usersRepository.count(updatedMatch.winner)) == 0)
          throw new ForbiddenException(
            "Can't update match (winner does not exists)",
          );
        match.winner = updatedMatch.winner;
      }
      await this.matchesRepository.save(match);
      return match;
    } catch (error) {
      throw error;
    }
  }

  async deleteMatch(matchID: number): Promise<void> {
    const match = await this.matchesRepository.findOne({
      relations: ['players', 'winner'],
      where: { id: matchID },
    });
    if (!match) throw new NotFoundException('Match not found (id incorrect)');
    else await this.matchesRepository.remove(match);
  }
}
