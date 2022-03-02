import User from '../../users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
class Message {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne((type) => User, (user) => user.id, { eager: true })
  public author: User;

  @Column()
  public channel: string;

  @Column()
  public data: string;
}

export default Message;
