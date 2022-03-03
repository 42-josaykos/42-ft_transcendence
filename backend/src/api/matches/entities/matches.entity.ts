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
  // @ManyToOne((type) => User, (user) => user.matchHistory)
  public id: number;

  @ManyToOne((type) => User, (user) => user.matchHistory)
  public playerOne: User;

  @ManyToOne((type) => User, (user) => user.matchHistory)
  public playerTwo: User;

  @Column()
  public scorePlayerOne: number;

  @Column()
  public scorePlayerTwo: number;

  @ManyToOne((type) => User, (user) => user.matchHistory)
  public winner: User;
}

export default Match;
