/* eslint-disable @typescript-eslint/no-unused-vars */
import Channel from 'src/api/channels/entities/channel.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from './user.entity';

@Entity()
class BanedUser {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne((type) => User, (user) => user.banChannels, {
    onDelete: 'CASCADE',
  })
  public user: User;

  @ManyToOne((type) => Channel, (channel) => channel.bans, {
    onDelete: 'CASCADE',
  })
  public channel: Channel;

  @CreateDateColumn({ type: 'timestamptz', nullable: false })
  public date: Date;

  @Column({ type: 'time', nullable: true })
  public time?: string;
}

export default BanedUser;
