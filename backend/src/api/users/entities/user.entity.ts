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

@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public username: string;

  @OneToOne((type) => Stats, (stats) => stats.user)
  public stats: Stats;

  @OneToMany((type) => Message, (message) => message.author)
  public messages: Message[];

  @ManyToMany((type) => Channel, (channels) => channels.id, {
    // eager: true,
    primary: true,
  })
  public channels: Channel[];
}

export default User;
