import { Controller, Get, Param } from '@nestjs/common';
import { StatsService } from './stats.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('stats')
@ApiTags('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get(':id')
  getStatsByID(@Param('id') userID: number) {
    return this.statsService.getStatsByID(userID);
  }

  @Get(':id/played')
  getStatPlayed(@Param('id') userID: number) {
    return this.statsService.getStatPlayed(userID);
  }

  @Get(':id/win')
  getStatWin(@Param('id') userID: number) {
    return this.statsService.getStatWin(userID);
  }

  @Get(':id/lose')
  getStatLose(@Param('id') userID: number) {
    return this.statsService.getStatLose(userID);
  }

  @Get(':id/ratio')
  getStatRatio(@Param('id') userID: number) {
    return this.statsService.getStatRatio(userID);
  }
}
