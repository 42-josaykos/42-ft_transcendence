import User from 'src/api/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
class Match {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToMany((type) => User, (user) => user.playedMatches, {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  public players: User[];

  @Column('int', { array: true })
  public score: number[];

  @ManyToOne((type) => User, (user) => user.winMatches, {
    eager: true,
    cascade: true,
  })
  public winner: User;

  @Column({ default: false })
  public isRankedMatch: boolean;
}

export default Match;
