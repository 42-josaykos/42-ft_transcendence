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
  async getAllUsers() {
    return await this.usersService.getAllUsers();
  }

  @Get(':login')
  async getUser(@Param('login') login: string) {
    return await this.usersService.getUserByLogin(login);
  }

  @Post()
  async createUser(@Body() createUserDTO: CreateUserDTO) {
    return await this.usersService.createUser(createUserDTO);
  }

  @Put(':login')
  async updateUser(@Param('login') login: string, @Body() createUserDTO: CreateUserDTO) {
    return await this.usersService.updateUser(login, createUserDTO);
  }

  @Delete(':login')
  async deleteUser(@Param('login') login: string) {
    return await this.usersService.deleteUser(login);
  }
}
