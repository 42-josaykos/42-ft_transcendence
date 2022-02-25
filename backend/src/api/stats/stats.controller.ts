import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { StatsService } from './stats.service';
import { ApiTags } from '@nestjs/swagger';
import Stats from './entities/stats.entity';

@Controller('stats')
@ApiTags('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  getAllStats(): Promise<Stats[]> {
    return this.statsService.getAllStats();
  }

  @Get(':id')
  getStatsByID(@Param('id', ParseIntPipe) userID: number) {
    return this.statsService.getStatsByID(userID);
  }

  @Get(':id/played')
  getStatPlayed(@Param('id', ParseIntPipe) userID: number) {
    return this.statsService.getStatPlayed(userID);
  }

  @Get(':id/win')
  getStatWin(@Param('id', ParseIntPipe) userID: number) {
    return this.statsService.getStatWin(userID);
  }

  @Get(':id/lose')
  getStatLose(@Param('id', ParseIntPipe) userID: number) {
    return this.statsService.getStatLose(userID);
  }

  @Get(':id/ratio')
  getStatRatio(@Param('id', ParseIntPipe) userID: number) {
    return this.statsService.getStatRatio(userID);
  }
}
