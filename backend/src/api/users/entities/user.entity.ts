/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Stats from 'src/api/stats/entities/stats.entity';
import Message from 'src/api/messages/entities/message.entity';
import Channel from 'src/api/channels/entities/channel.entity';
import Match from 'src/api/matches/entities/matches.entity';

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

  @ManyToMany((type) => Channel, (channel) => channel.mutes)
  public muteChannels: Channel[];

  @ManyToMany((type) => Channel, (channel) => channel.bans)
  public banChannels: Channel[];
}

export default User;
