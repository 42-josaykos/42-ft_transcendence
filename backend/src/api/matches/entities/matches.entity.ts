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
  @ManyToOne((type) => User, (user) => user.matchHistory)
  public id: number;

  @ManyToOne((type) => User, (user) => user.id)
  public playerOne: User;

  @ManyToOne((type) => User, (user) => user.id)
  public playerTwo: User;

  @ManyToOne((type) => User, (user) => user.id)
  public winner: User;

  @Column('int', { array: true })
  public score: number[];
}

export default Match;
