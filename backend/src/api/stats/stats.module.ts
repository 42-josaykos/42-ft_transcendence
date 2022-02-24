import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import Stats from './entities/stats.entity';
import { CreateStatsDTO } from './dto/create-stats.dto';

const initializeStats = {
  user: null,
  played: 0,
  win: 0,
  lose: 0,
  ratio: 0.0,
  // history: null,
};

@Module({
  imports: [Stats, CreateStatsDTO, TypeOrmModule.forFeature([Stats])],
  exports: [Stats, CreateStatsDTO, StatsService],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
