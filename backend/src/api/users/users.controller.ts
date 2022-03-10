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
import User from './entities/user.entity';
import Match from 'src/api/matches/entities/matches.entity';
import Channel from 'src/api/channels/entities/channel.entity';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly utilsProvider: Utils,
  ) {}

  // CRUD related
  @Get()
  async getAllUsers(@Query() filter: FilterUserDTO): Promise<User[]> {
    if (!this.utilsProvider.isEmptyObject(filter))
      return await this.getUsersbyFilter(filter);
    else return await this.usersService.getAllUsers();
  }

  @Get()
  async getUsersbyFilter(filter: FilterUserDTO): Promise<User[]> {
    return await this.usersService.getUsersByFilter(filter);
  }

  @Get(':id')
  async getUserbyID(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return await this.usersService.getUserByID(id);
  }

  @Post()
  async createUser(@Body() createUserDTO: CreateUserDTO): Promise<User> {
    return await this.usersService.createUser(createUserDTO);
  }

  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() createUserDTO: CreateUserDTO,
  ): Promise<User> {
    return await this.usersService.updateUser(id, createUserDTO);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<void> {
    return await this.usersService.deleteUser(id);
  }

  // Match related
  @Get(':id/matches/played')
  async getUserMatchesPlayed(
    @Param('id', ParseIntPipe) userID: number,
  ): Promise<Match[]> {
    return await this.usersService.getUserMatchesPlayed(userID);
  }

  @Get(':id/matches/won')
  async getUserMatchesWon(
    @Param('id', ParseIntPipe) userID: number,
  ): Promise<Match[]> {
    return await this.usersService.getUserMatchesWon(userID);
  }

  // Channel related
  @Get(':id/channels/owned')
  async getUserChannelsOwned(
    @Param('id', ParseIntPipe) userID: number,
  ): Promise<Channel[]> {
    return await this.usersService.getUserChannelsOwned(userID);
  }

  @Get(':id/channels/admin')
  async getUserChannelsAdmin(
    @Param('id', ParseIntPipe) userID: number,
  ): Promise<Channel[]> {
    return await this.usersService.getUserChannelsAdmin(userID);
  }

  @Get(':id/channels/member')
  async getUserChannelsMember(
    @Param('id', ParseIntPipe) userID: number,
  ): Promise<Channel[]> {
    return await this.usersService.getUserChannelsMember(userID);
  }

  @Get(':id/channels/muted')
  async getUserChannelsMuted(
    @Param('id', ParseIntPipe) userID: number,
  ): Promise<Channel[]> {
    return await this.usersService.getUserChannelsMuted(userID);
  }

  @Get(':id/channels/baned')
  async getUserChannelsBaned(
    @Param('id', ParseIntPipe) userID: number,
  ): Promise<Channel[]> {
    return await this.usersService.getUserChannelsBaned(userID);
  }
}

// Redirections to Stats from '/stats/:id'
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

// Redirections to Messages from '/messages/:id'
@Controller('users/:userID/messages')
@ApiTags('users')
@ApiResponse({ status: HttpStatus.SEE_OTHER })
export class MessagesRedirection {
  @Get()
  @Redirect('/messages', HttpStatus.SEE_OTHER)
  async getMessages(@Param('userID', ParseIntPipe) userID: number) {
    return { url: `/messages/search?authorID=${userID}` };
  }

  @Get(':messageID')
  @Redirect('/messages', HttpStatus.SEE_OTHER)
  async getMessageByID(@Param('messageID', ParseIntPipe) messageID: number) {
    return { url: `/messages/${messageID}` };
  }

  @Get(':messageID/author')
  @Redirect('/messages', HttpStatus.SEE_OTHER)
  async getMessageAuthor(@Param('messageID', ParseIntPipe) messageID: number) {
    return { url: `/messages/${messageID}/author` };
  }

  @Get(':messageID/channel')
  @Redirect('/messages', HttpStatus.SEE_OTHER)
  async getMessageChannel(@Param('messageID', ParseIntPipe) messageID: number) {
    return { url: `/messages/${messageID}/channel` };
  }

  @Get(':messageID/data')
  @Redirect('/messages', HttpStatus.SEE_OTHER)
  async getMessageData(@Param('messageID', ParseIntPipe) messageID: number) {
    return { url: `/messages/${messageID}/data` };
  }
}