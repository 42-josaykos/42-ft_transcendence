import {
  PrimaryColumn,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import Match from '../../matches/entities/matches.entity';
import User from '../../users/entities/user.entity';

@Entity()
class Stats {
  @PrimaryGeneratedColumn()
  public id: number;

  @OneToOne((type) => User, (user) => user.stats, {
    onDelete: 'CASCADE',
  })
  public user: User;

  @Column()
  public played: number;

  @Column()
  public win: number;

  @Column()
  public lose: number;

  @Column()
  public ratio: number;
}

export default Stats;
