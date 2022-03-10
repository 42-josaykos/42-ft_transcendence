import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { StatsService } from './stats.service';
import { ApiTags } from '@nestjs/swagger';
import Stats from './entities/stats.entity';
import { UpdateStatsDTO } from './dto/update-stats.dto';

@Controller('stats')
@ApiTags('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  async getAllStats(): Promise<Stats[]> {
    return await this.statsService.getAllStats();
  }

  @Get(':id')
  async getStatsByID(
    @Param('id', ParseIntPipe) statsID: number,
  ): Promise<Stats> {
    return await this.statsService.getStatsByID(statsID);
  }

  @Get(':id/played')
  async getStatPlayed(
    @Param('id', ParseIntPipe) statsID: number,
  ): Promise<number> {
    return await this.statsService.getStatPlayed(statsID);
  }

  @Get(':id/win')
  async getStatWin(
    @Param('id', ParseIntPipe) statsID: number,
  ): Promise<number> {
    return await this.statsService.getStatWin(statsID);
  }

  @Get(':id/lose')
  async getStatLose(
    @Param('id', ParseIntPipe) statsID: number,
  ): Promise<number> {
    return await this.statsService.getStatLose(statsID);
  }

  @Get(':id/ratio')
  async getStatRatio(
    @Param('id', ParseIntPipe) statsID: number,
  ): Promise<number> {
    return await this.statsService.getStatRatio(statsID);
  }

  @Patch(':id')
  async updateStats(
    @Param('id', ParseIntPipe) statsID: number,
    @Body() updatedStats: UpdateStatsDTO,
  ): Promise<Stats> {
    return await this.statsService.updateStats(statsID, updatedStats);
  }
}
