/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  ManyToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import Stats from 'src/api/stats/entities/stats.entity';
import Message from 'src/api/messages/entities/message.entity';
import Channel from 'src/api/channels/entities/channel.entity';
import Match from 'src/api/matches/entities/matches.entity';
import MutedUser from './muted.user.entity';
import BanedUser from './baned.user.entity';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  public username: string;

  @Column({ nullable: true, select: false })
  public password: string;

  @Column({ nullable: true, unique: true, select: false })
  public studentID: string;

  @Column({ nullable: true, unique: true, select: false })
  public githubID: string;

  @Column({ nullable: true, select: false, length: 20 })
  public socketID: string | null;

  @Column({ nullable: true })
  public avatar: string;

  @OneToOne((type) => Stats, (stats) => stats.user)
  public stats: Stats;

  // User related relations
  @ManyToMany((type) => User, (user) => user.friendsInverse, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  @JoinTable()
  public friends: User[]; // Users who I am friends with

  @ManyToMany((type) => User, (user) => user.friends)
  public friendsInverse: User[]; // Users who are friends with me

  @ManyToMany((type) => User, (user) => user.blockedUsersInverse, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  @JoinTable()
  public blockedUsers: User[]; // Users I blocked

  @ManyToMany((type) => User, (user) => user.blockedUsers)
  public blockedUsersInverse: User[]; // Users who blocked me

  // Match related relations
  @ManyToMany((type) => Match, (match) => match.players)
  public playedMatches: Match[];

  @OneToMany((type) => Match, (match) => match.winner)
  public winMatches: Match[];

  // Message related relations
  @OneToMany((type) => Message, (message) => message.author)
  public messages: Message[];

  // Channel related relations
  @OneToMany((type) => Channel, (channel) => channel.owner)
  public ownerChannels: Channel[];

  @ManyToMany((type) => Channel, (channel) => channel.admins)
  public adminChannels: Channel[];

  @ManyToMany((type) => Channel, (channel) => channel.members)
  public memberChannels: Channel[];

  @OneToMany((type) => MutedUser, (mute) => mute.user)
  public muteChannels: MutedUser[];

  // @OneToMany((type) => BanedUser, (ban) => ban.user)
  // public banChannels: BanedUser[];

  @ManyToMany((type) => Channel, (channel) => channel.invites)
  public inviteChannels: Channel[];
}

export default User;
