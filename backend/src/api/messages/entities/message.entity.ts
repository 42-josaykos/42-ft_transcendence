import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from 'src/api/users/entities/user.entity';
import Channel from 'src/api/channels/entities/channel.entity';

@Entity()
class Message {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne((type) => User, (user) => user.id)
  public author: User;

  @ManyToOne((type) => Channel, (channel) => channel.messages)
  public channel: Channel;

  @Column()
  public data: string;
}

export default Message;
