import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import Stats from './entities/stats.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Stats])],
  exports: [StatsService],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
