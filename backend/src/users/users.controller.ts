import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
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

  @Put(':login')
  updateUser(@Param('login') login: string, @Body() user: CreateUserDTO) {
    return this.usersService.updateUser(login, user);
  }

  @Delete(':login')
  deleteUser(@Param('login') login: string) {
    return this.usersService.deleteUser(login);
  }
}
