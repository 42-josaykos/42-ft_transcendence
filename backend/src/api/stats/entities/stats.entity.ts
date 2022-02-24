import {
  PrimaryColumn,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import Match from '../../matches/entities/matches.entity';
import User from '../../users/entities/user.entity';

@Entity()
class Stats {
  @OneToOne((type) => User, {
    primary: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  public user: User;

  @Column()
  public played: number;

  @Column()
  public win: number;

  @Column()
  public lose: number;

  @Column()
  public ratio: number;

  // @Column('int', { array: true })
  // public history: Match[];
}

export default Stats;
