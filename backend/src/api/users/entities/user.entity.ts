import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  ManyToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  JoinTable,
} from 'typeorm';
import Stats from '../../stats/entities/stats.entity';
import Message from '../../messages/entities/message.entity';
import Channel from 'src/api/channels/entities/channel.entity';
import Match from 'src/api/matches/entities/matches.entity';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public username: string;

  @OneToOne((type) => Stats, (stats) => stats.user)
  @JoinColumn()
  public stats: Stats;

  @ManyToMany((type) => Match, (match) => match.players)
  @JoinTable()
  public matches: Match[];

  @OneToMany((type) => Message, (message) => message.author)
  public messages: Message[];

  // Channel related relations
  @OneToMany((type) => Channel, (channel) => channel.owner)
  public ownerChannels: Channel[];

  @ManyToMany((type) => Channel, (channel) => channel.admins)
  // @JoinTable()
  public adminChannels: Channel[];

  @ManyToMany((type) => Channel, (channel) => channel.members)
  // @JoinTable()
  public memberChannels: Channel[];

  @ManyToMany((type) => Channel, (channel) => channel.mutes)
  // @JoinTable()
  public muteChannels: Channel[];

  @ManyToMany((type) => Channel, (channel) => channel.bans)
  // @JoinTable()
  public banChannels: Channel[];
}

export default User;
