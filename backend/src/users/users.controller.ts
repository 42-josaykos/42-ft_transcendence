import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
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

  @Post()
  createUser(@Body() user: CreateUserDTO) {
    return this.usersService.createUser(user);
  }
}
