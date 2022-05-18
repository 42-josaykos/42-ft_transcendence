import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  Query,
  Redirect,
  HttpStatus,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { FilterUserDTO } from './dto/filter-user.dto';
import User from './entities/user.entity';
import Match from 'src/api/matches/entities/matches.entity';
import Channel from 'src/api/channels/entities/channel.entity';
import { UpdateUserDTO } from './dto/update-user.dto';
import { JwtAccessGuard, JwtTwoFactorGuard } from 'src/auth/guards';
import { Utils } from 'src/utils/utils.provider';
import MutedUser from './entities/muted.user.entity';
import BanedUser from './entities/baned.user.entity';

@Controller('users')
@ApiTags('users')
@UseGuards(JwtAccessGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly utilsProvider: Utils,
  ) {}

  // CRUD related
  @Get()
  @UseGuards(JwtTwoFactorGuard)
  async getAllUsers(): Promise<User[]> {
    return await this.usersService.getAllUsers();
  }

  @Get('search')
  async getUsersbyFilter(@Query() filter: FilterUserDTO): Promise<User[]> {
    return await this.usersService.getUsersByFilter(filter);
  }

  @Get(':userID')
  async getUserbyID(
    @Param('userID', ParseIntPipe) userID: number,
    @Query() filter: FilterUserDTO,
  ): Promise<User> {
    // Loading the specific relations if there is a filter
    if (this.utilsProvider.isEmptyObject(filter))
      return await this.usersService.getUserByID(userID);
    try {
      // Removing search parameters, and setting up correct userID
      const searchParams = { id: '', username: '', gitID: '', studID: '' };
      for (const key in searchParams) delete filter[key];
      filter.id = userID;

      const [user] = await this.usersService.getUsersByFilter(filter);
      return user;
    } catch (error) {
      throw error;
    }
  }

  @Get(':userID/socketID')
  async getUserSocketID(
    @Param('userID', ParseIntPipe) userID: number,
  ): Promise<string> {
    return await this.usersService.getUserSocketID(userID);
  }

  @Post()
  async createUser(@Body() createUserDTO: CreateUserDTO): Promise<User> {
    return await this.usersService.createUser(createUserDTO);
  }

  @Patch(':userID')
  async updateUser(
    @Param('userID', ParseIntPipe) userID: number,
    @Body() updatedUser: UpdateUserDTO,
  ): Promise<User> {
    return await this.usersService.updateUser(userID, updatedUser);
  }

  @Delete(':userID')
  async deleteUser(@Param('userID') userID: number): Promise<void> {
    return await this.usersService.deleteUser(userID);
  }

  // User related
  @Get(':userID/friends')
  async getUserFriends(
    @Param('userID', ParseIntPipe) userID: number,
  ): Promise<User[]> {
    return await this.usersService.getUserFriends(userID);
  }

  @Get(':userID/friendsInverse')
  async getUserFriendsInverse(
    @Param('userID', ParseIntPipe) userID: number,
  ): Promise<User[]> {
    return await this.usersService.getUserFriendsInverse(userID);
  }

  @Get(':userID/blockedUsers')
  async getUsersBlocked(
    @Param('userID', ParseIntPipe) userID: number,
  ): Promise<User[]> {
    return await this.usersService.getBlockedUsers(userID);
  }

  @Get(':userID/blockedUsersInverse')
  async getUsersBlockedInverse(
    @Param('userID', ParseIntPipe) userID: number,
  ): Promise<User[]> {
    return await this.usersService.getBlockedUsersInverse(userID);
  }

  // Match related
  @Get(':userID/matches/played')
  async getUserMatchesPlayed(
    @Param('userID', ParseIntPipe) userID: number,
  ): Promise<Match[]> {
    return await this.usersService.getUserMatchesPlayed(userID);
  }

  @Get(':userID/matches/won')
  async getUserMatchesWon(
    @Param('userID', ParseIntPipe) userID: number,
  ): Promise<Match[]> {
    return await this.usersService.getUserMatchesWon(userID);
  }

  // Channel related
  @Get(':userID/channels/owned')
  async getUserChannelsOwned(
    @Param('userID', ParseIntPipe) userID: number,
  ): Promise<Channel[]> {
    return await this.usersService.getUserChannelsOwned(userID);
  }

  @Get(':userID/channels/admin')
  async getUserChannelsAdmin(
    @Param('userID', ParseIntPipe) userID: number,
  ): Promise<Channel[]> {
    return await this.usersService.getUserChannelsAdmin(userID);
  }

  @Get(':userID/channels/member')
  async getUserChannelsMember(
    @Param('userID', ParseIntPipe) userID: number,
  ): Promise<Channel[]> {
    return await this.usersService.getUserChannelsMember(userID);
  }

  @Get(':userID/channels/muted')
  async getUserChannelsMuted(
    @Param('userID', ParseIntPipe) userID: number,
  ): Promise<MutedUser[]> {
    return await this.usersService.getUserChannelsMuted(userID);
  }

  @Get(':userID/channels/baned')
  async getUserChannelsBaned(
    @Param('userID', ParseIntPipe) userID: number,
  ): Promise<BanedUser[]> {
    return await this.usersService.getUserChannelsBaned(userID);
  }

  @Get(':userID/channels/invites')
  async getUserChannelsInvites(
    @Param('userID', ParseIntPipe) userID: number,
  ): Promise<Channel[]> {
    return await this.usersService.getUserChannelsInvites(userID);
  }
}

// Redirections to Stats from '/stats/:id'
@Controller('users/:userID/stats')
@ApiTags('users')
@ApiResponse({ status: HttpStatus.SEE_OTHER })
export class StatsRedirection {
  @Get()
  @Redirect('/stats', HttpStatus.SEE_OTHER)
  async getStats(@Param('userID', ParseIntPipe) userID: number) {
    return { url: `/stats/${userID}` };
  }

  @Get('/played')
  @Redirect('/stats', HttpStatus.SEE_OTHER)
  async getStatPlayed(@Param('userID', ParseIntPipe) userID: number) {
    return { url: `/stats/${userID}/played` };
  }

  @Get('/win')
  @Redirect('/stats', HttpStatus.SEE_OTHER)
  async getStatWin(@Param('userID', ParseIntPipe) userID: number) {
    return { url: `/stats/${userID}/win` };
  }

  @Get('/lose')
  @Redirect('/stats', HttpStatus.SEE_OTHER)
  async getStatLose(@Param('userID', ParseIntPipe) userID: number) {
    return { url: `/stats/${userID}/lose` };
  }

  @Get('/ratio')
  @Redirect('/stats', HttpStatus.SEE_OTHER)
  async getStatRatio(@Param('userID', ParseIntPipe) userID: number) {
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
