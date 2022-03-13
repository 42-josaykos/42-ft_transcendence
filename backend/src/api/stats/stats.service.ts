import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stats from './entities/stats.entity';
import User from '../users/entities/user.entity';
import { UpdateStatsDTO } from './dto/update-stats.dto';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Stats)
    private statsRepository: Repository<Stats>,
  ) {}

  //Basic GET routes
  async getAllStats(): Promise<Stats[]> {
    return await this.statsRepository.find({
      order: { id: 'ASC' },
      relations: ['user'],
    });
  }

  async getStatsByID(statsID: number): Promise<Stats> {
    const stats = await this.statsRepository.findOne({
      where: { id: statsID },
      relations: ['user'],
    });
    if (!stats) throw new NotFoundException('Stats not found (id incorrect)');
    return stats;
  }

  async getStatPlayed(statsID: number): Promise<number> {
    try {
      const stats = await this.getStatsByID(statsID);
      return stats.played;
    } catch (error) {
      throw error;
    }
  }

  async getStatWin(statsID: number): Promise<number> {
    try {
      const stats = await this.getStatsByID(statsID);
      return stats.win;
    } catch (error) {
      throw error;
    }
  }

  async getStatLose(statsID: number): Promise<number> {
    try {
      const stats = await this.getStatsByID(statsID);
      return stats.lose;
    } catch (error) {
      throw error;
    }
  }

  async getStatRatio(statsID: number): Promise<number> {
    try {
      const stats = await this.getStatsByID(statsID);
      return stats.ratio;
    } catch (error) {
      throw error;
    }
  }

  async updateStats(
    statsID: number,
    updatedStats: UpdateStatsDTO,
  ): Promise<Stats> {
    const stats = await this.statsRepository.findOne({
      where: { id: statsID },
    });
    if (!stats) throw new NotFoundException('Stats not found (id incorrect)');
    else {
      await this.statsRepository.update(statsID, updatedStats);
      return this.getStatsByID(statsID);
    }
  }
}
