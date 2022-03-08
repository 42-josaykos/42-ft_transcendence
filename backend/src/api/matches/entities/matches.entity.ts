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

  @ManyToMany((type) => User, (user) => user.matches, {
    eager: true,
    cascade: true,
  })
  public players: User[];

  @Column('int', { array: true })
  public score: number[];

  @ManyToOne((type) => User, (user) => user.matches, {
    eager: true,
    cascade: true,
  })
  public winner: User;
}

export default Match;
