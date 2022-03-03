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
  @OneToOne((type) => User, (user) => user.stats, {
    primary: true,
    onDelete: 'CASCADE',
    eager: true,
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

  // @OneToMany((type) => Match, (history) => history.id, {
  //   primary: true,
  //   // eager: true,
  // })
  // @JoinColumn()
  // public history: Match[];
}

export default Stats;
