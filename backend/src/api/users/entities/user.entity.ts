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

  @ManyToMany((type) => Channel, (channel) => channel.members)
  @JoinTable()
  public channels: Channel[];
}

export default User;
