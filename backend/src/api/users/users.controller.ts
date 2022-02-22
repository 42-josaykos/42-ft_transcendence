import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDTO } from './dto/create-user.dto';
import { FilterUserDTO } from './dto/filter-user.dto';
import UsersService from './users.service';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(@Query() filter: FilterUserDTO) {
    if (filter.username) return await this.getUserbyUsername(filter.username);
    else return await this.usersService.getAllUsers();
  }

  @Get()
  async getUserbyUsername(username: string) {
    return await this.usersService.getUserByUsername(username);
  }

  @Get(':id')
  async getUserbyID(@Param('id') id: number) {
    return await this.usersService.getUserByID(id);
  }

  @Post()
  async createUser(@Body() createUserDTO: CreateUserDTO) {
    return await this.usersService.createUser(createUserDTO);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() createUserDTO: CreateUserDTO,
  ) {
    return await this.usersService.updateUser(id, createUserDTO);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    return await this.usersService.deleteUser(id);
  }
}
