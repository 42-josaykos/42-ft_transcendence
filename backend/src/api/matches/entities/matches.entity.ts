import Stats from 'src/api/stats/entities/stats.entity';
import User from 'src/api/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
class Match {
  @PrimaryGeneratedColumn()
  @ManyToOne((type) => Stats, (stats) => stats.history)
  public id: number;

  @OneToOne((type) => User, (playerOne) => playerOne.id)
  @JoinColumn()
  public playerOne: User;

  @OneToOne((type) => User, (playerTwo) => playerTwo.id)
  @JoinColumn()
  public playerTwo: User;

  @OneToOne((type) => User, (winner) => winner.id)
  @JoinColumn()
  public winner: User;

  @Column('int', { array: true })
  public score: number[];
}

export default Match;
