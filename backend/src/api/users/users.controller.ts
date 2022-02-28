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
  ParseIntPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { FilterUserDTO } from './dto/filter-user.dto';
import { Utils } from 'src/utils.provider';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly utilsProvider: Utils,
  ) {}

  @Get()
  async getAllUsers(@Query() filter: FilterUserDTO) {
    if (!this.utilsProvider.isEmptyObject(filter))
      return await this.getUsersbyFilter(filter);
    else return await this.usersService.getAllUsers();
  }

  @Get()
  async getUsersbyFilter(filter: FilterUserDTO) {
    return await this.usersService.getUsersByFilter(filter);
  }

  @Get(':id')
  async getUserbyID(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.getUserByID(id);
  }

  @Post()
  async createUser(@Body() createUserDTO: CreateUserDTO) {
    return await this.usersService.createUser(createUserDTO);
  }

  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
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
  async getStats(@Param('id', ParseIntPipe) userID: number) {
    return { url: `/stats/${userID}` };
  }

  @Get('/played')
  @Redirect('/stats', HttpStatus.SEE_OTHER)
  async getStatPlayed(@Param('id', ParseIntPipe) userID: number) {
    return { url: `/stats/${userID}/played` };
  }

  @Get('/win')
  @Redirect('/stats', HttpStatus.SEE_OTHER)
  async getStatWin(@Param('id', ParseIntPipe) userID: number) {
    return { url: `/stats/${userID}/win` };
  }

  @Get('/lose')
  @Redirect('/stats', HttpStatus.SEE_OTHER)
  async getStatLose(@Param('id', ParseIntPipe) userID: number) {
    return { url: `/stats/${userID}/lose` };
  }

  @Get('/ratio')
  @Redirect('/stats', HttpStatus.SEE_OTHER)
  async getStatRatio(@Param('id', ParseIntPipe) userID: number) {
    return { url: `/stats/${userID}/ratio` };
  }
}
