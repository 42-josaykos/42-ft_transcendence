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
  public stats: Stats;

  @OneToMany((type) => Match, (match) => match.id)
  public matchHistory: Match[];

  @OneToMany((type) => Message, (message) => message.author)
  public messages: Message[];

  @ManyToMany((type) => Channel, (channel) => channel.id, {
    // eager: true,
    primary: true,
  })
  public channels: Channel[];
}

export default User;
