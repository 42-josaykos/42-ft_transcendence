import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Brackets, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMatchDTO } from './dto/create-match.dto';
import { UpdateMatchDTO } from './dto/update-match.dto';
import { FilterMatchDTO } from './dto/filter-match.dto';
import Match from './entities/matches.entity';
import User from '../users/entities/user.entity';

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

  async getMatchesByFilter(filter: FilterMatchDTO): Promise<Match[]> {
    const query = this.matchesRepository
      .createQueryBuilder('matches')
      .leftJoinAndSelect('matches.players', 'players')
      .leftJoinAndSelect('matches.winner', 'winner')
      .orderBy('matches.id', 'DESC');

    if (filter.playerOneID)
      query.andWhere('players.id = :playerOneID', {
        playerOneID: filter.playerOneID,
      });
    if (filter.playerOneName)
      query.andWhere('players.username = :playerOneName', {
        playerOneName: filter.playerOneName,
      });
    if (filter.playerTwoID)
      query.andWhere('players.id = :playerTwoID', {
        playerTwoID: filter.playerTwoID,
      });
    if (filter.playerTwoName)
      query.andWhere('players.username = :playerTwoName', {
        playerTwoName: filter.playerTwoName,
      });
    if (filter.playerOneScore)
      query.andWhere('matches.score[0] = :playerOneScore', {
        playerOneScore: [filter.playerOneScore],
      });
    if (filter.playerTwoScore)
      query.andWhere('matches.score[1] = :playerTwoScore', {
        playerTwoScore: filter.playerTwoScore,
      });
    if (filter.winnerID)
      query.andWhere('winner.id = :winnerID', {
        winnerID: filter.winnerID,
      });
    if (filter.winnerName)
      query.andWhere('winner.username = :winnerName', {
        winnerName: filter.winnerName,
      });

    const matches = await query.getMany();
    if (!matches.length)
      throw new NotFoundException('Matches not found (filter incorrect)');

    return matches;
  }

  async createMatch(match: CreateMatchDTO): Promise<Match> {
    try {
      await this.validateMatch(match);
      const newMatch = this.matchesRepository.create(match);

      // Deciding winner if no 'winner' key in body
      if (!newMatch.winner) {
        if (newMatch.score[0] > newMatch.score[1])
          newMatch.winner = newMatch.players[0];
        else newMatch.winner = newMatch.players[1];
      }

      // Updating player stats
      const playerOne = await this.usersRepository.findOne(
        newMatch.players[0],
        { relations: ['stats'] },
      );
      const playerTwo = await this.usersRepository.findOne(
        newMatch.players[1],
        { relations: ['stats'] },
      );
      const winner =
        playerOne.id === newMatch.winner.id ? playerOne : playerTwo;
      const looser =
        playerOne.id === newMatch.winner.id ? playerTwo : playerOne;

      ++winner.stats.played;
      ++looser.stats.played;
      ++winner.stats.win;
      ++looser.stats.lose;
      winner.stats.ratio = winner.stats.win / winner.stats.lose;
      looser.stats.ratio = looser.stats.win / looser.stats.lose;

      await this.usersRepository.save(winner);
      await this.usersRepository.save(looser);

      await this.matchesRepository.save(newMatch);
      return this.getMatchByID(newMatch.id);
    } catch (error) {
      throw error;
    }
  }

  async updateMatch(
    matchID: number,
    updatedMatch: UpdateMatchDTO,
  ): Promise<Match> {
    try {
      await this.validateMatch(updatedMatch);
      const match = await this.getMatchByID(matchID);
      //Checking what is updated
      if (updatedMatch.players) match.players = updatedMatch.players;
      if (updatedMatch.score) match.score = updatedMatch.score;
      if (updatedMatch.winner) match.winner = updatedMatch.winner;
      if (updatedMatch.playerOne) match.players[0] = updatedMatch.playerOne;
      if (updatedMatch.playerTwo) match.players[1] = updatedMatch.playerTwo;
      if (updatedMatch.scorePlayerOne)
        match.score[0] = updatedMatch.scorePlayerOne;
      if (updatedMatch.scorePlayerTwo)
        match.score[1] = updatedMatch.scorePlayerTwo;
      await this.matchesRepository.save(match);
      return await this.getMatchByID(matchID);
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

  async validateMatch(match: CreateMatchDTO | UpdateMatchDTO): Promise<void> {
    // Checking if players exists
    if (match.players) {
      for (const player of match.players) {
        if ((await this.usersRepository.count(player)) === 0)
          throw new ForbiddenException(
            "Can't create / update channel (player does not exists)",
          );
      }
    }
    // Checking if playerOne exists
    if (
      'playerOne' in match &&
      (await this.usersRepository.count(match.playerOne)) === 0
    )
      throw new ForbiddenException(
        "Can't create / update channel (playerOne does not exists)",
      );
    // Checking if playerTwo exists
    if (
      'playerTwo' in match &&
      (await this.usersRepository.count(match.playerTwo)) === 0
    )
      throw new ForbiddenException(
        "Can't create / update channel (playerTwo does not exists)",
      );
    // Checking if winner exists
    if (
      'winner' in match &&
      (await this.usersRepository.count(match.winner)) === 0
    )
      throw new ForbiddenException(
        "Can't create / update channel (winner does not exists)",
      );
  }
}
