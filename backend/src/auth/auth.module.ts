import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './auth.controller';
import { AuthService, SessionSerializer } from './auth.service';
import { FortyTwoStrategy } from './strategies/ft.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/api/users/entities/user.entity';
import { TypeORMSession } from './entities/session.entity';
import { GithubStrategy } from './strategies/github.strategy';
import { UsersService } from 'src/api/users/users.service';
import Stats from 'src/api/stats/entities/stats.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([User, Stats, TypeORMSession]),
  ],
  exports: [
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
    {
      provide: 'USERS_SERVICE',
      useClass: UsersService,
    },
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    FortyTwoStrategy,
    GithubStrategy,
    SessionSerializer,
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
    {
      provide: 'USERS_SERVICE',
      useClass: UsersService,
    },
  ],
})
export class AuthModule {}
