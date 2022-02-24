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
  Redirect,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
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

// Redirections to user stats from '/stats/:id'
@Controller('users/:id/stats')
@ApiTags('users')
@ApiResponse({ status: HttpStatus.SEE_OTHER })
export class StatsRedirection {
  @Get()
  @Redirect('/stats', HttpStatus.SEE_OTHER)
  async getStats(@Param('id') userID: number) {
    return { url: `/stats/${userID}` };
  }

  @Get('/played')
  @Redirect('/stats', HttpStatus.SEE_OTHER)
  async getStatPlayed(@Param('id') userID: number) {
    return { url: `/stats/${userID}/played` };
  }

  @Get('/win')
  @Redirect('/stats', HttpStatus.SEE_OTHER)
  async getStatWin(@Param('id') userID: number) {
    return { url: `/stats/${userID}/win` };
  }

  @Get('/lose')
  @Redirect('/stats', HttpStatus.SEE_OTHER)
  async getStatLose(@Param('id') userID: number) {
    return { url: `/stats/${userID}/lose` };
  }

  @Get('/ratio')
  @Redirect('/stats', HttpStatus.SEE_OTHER)
  async getStatRatio(@Param('id') userID: number) {
    return { url: `/stats/${userID}/ratio` };
  }
}
