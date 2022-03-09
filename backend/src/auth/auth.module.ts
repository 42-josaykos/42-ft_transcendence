import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './auth.controller';
import { AuthService, SessionSerializer } from './auth.service';
import { FortyTwoStrategy } from './strategies';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/api/users/entities/user.entity';
import { TypeORMSession } from './entities/session.entity';
import { GithubStrategy } from './strategies/github.strategy';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([User, TypeORMSession])],
  exports: [
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    FortyTwoStrategy,
    GithubStrategy,
    SessionSerializer,
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
  ],
})
export class AuthModule {}
