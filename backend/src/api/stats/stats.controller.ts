import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { StatsService } from './stats.service';
import { ApiTags } from '@nestjs/swagger';
import Stats from './entities/stats.entity';
import { UpdateStatsDTO } from './dto/update-stats.dto';
import { JwtAccessGuard } from 'src/auth/guards';

@Controller('stats')
@UseGuards(JwtAccessGuard)
@ApiTags('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  async getAllStats(): Promise<Stats[]> {
    return await this.statsService.getAllStats();
  }

  @Get(':statsID')
  async getStatsByID(
    @Param('statsID', ParseIntPipe) statsID: number,
  ): Promise<Stats> {
    return await this.statsService.getStatsByID(statsID);
  }

  @Get(':statsID/played')
  async getStatPlayed(
    @Param('statsID', ParseIntPipe) statsID: number,
  ): Promise<number> {
    return await this.statsService.getStatPlayed(statsID);
  }

  @Get(':statsID/win')
  async getStatWin(
    @Param('statsID', ParseIntPipe) statsID: number,
  ): Promise<number> {
    return await this.statsService.getStatWin(statsID);
  }

  @Get(':statsID/lose')
  async getStatLose(
    @Param('statsID', ParseIntPipe) statsID: number,
  ): Promise<number> {
    return await this.statsService.getStatLose(statsID);
  }

  @Get(':statsID/ratio')
  async getStatRatio(
    @Param('statsID', ParseIntPipe) statsID: number,
  ): Promise<number> {
    return await this.statsService.getStatRatio(statsID);
  }

  @Patch(':statsID')
  async updateStats(
    @Param('statsID', ParseIntPipe) statsID: number,
    @Body() updatedStats: UpdateStatsDTO,
  ): Promise<Stats> {
    return await this.statsService.updateStats(statsID, updatedStats);
  }
}
