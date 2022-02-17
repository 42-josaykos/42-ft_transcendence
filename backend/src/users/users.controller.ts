import { Controller, Get, Param } from '@nestjs/common';
import User from './entities/user.entity';

import UsersService from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsers(): User[] {
    return this.usersService.getAllUsers();
  }

  @Get(':login')
  getUser(@Param('login') login: string): User {
    return this.usersService.getUserByLogin(login);
  }
}
