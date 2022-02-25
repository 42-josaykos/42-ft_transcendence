import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Stats from '../../stats/entities/stats.entity';
import Message from '../../messages/entities/message.entity';

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
}

export default User;
