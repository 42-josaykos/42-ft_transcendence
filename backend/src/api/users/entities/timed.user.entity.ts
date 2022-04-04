/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import User from './user.entity';

@Entity()
class TimedUser {
  @ManyToOne((type) => User, {
    primary: true,
    eager: true,
  })
  public user: User;

  @CreateDateColumn({ type: 'timestamptz', nullable: false })
  //   @Column({ type: 'timestamptz', nullable: false })
  public date: Date;

  @Column({ type: 'time', nullable: true })
  public time?: string;
}

export default TimedUser;
