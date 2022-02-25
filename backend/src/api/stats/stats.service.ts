import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stats from './entities/stats.entity';
import User from '../users/entities/user.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Stats)
    private statsRepository: Repository<Stats>,
  ) {}

  //Basic GET routes
  async getAllStats(): Promise<Stats[]> {
    return await this.statsRepository.find();
  }

  async getStatsByID(userID: number): Promise<Stats> {
    const stats = await this.statsRepository.findOne({
      where: { user: userID },
    });
    if (!stats) throw new NotFoundException('Stats not found (id not correct)');
    return stats;
  }

  async getStatPlayed(userID: number): Promise<number> {
    try {
      const stats = await this.getStatsByID(userID);
      return stats.played;
    } catch (error) {
      throw error;
    }
  }

  async getStatWin(userID: number): Promise<number> {
    try {
      const stats = await this.getStatsByID(userID);
      return stats.win;
    } catch (error) {
      throw error;
    }
  }

  async getStatLose(userID: number): Promise<number> {
    try {
      const stats = await this.getStatsByID(userID);
      return stats.lose;
    } catch (error) {
      throw error;
    }
  }

  async getStatRatio(userID: number): Promise<number> {
    try {
      const stats = await this.getStatsByID(userID);
      return stats.ratio;
    } catch (error) {
      throw error;
    }
  }
}
