import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Match {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public playerOne: number;

  @Column()
  public playerTwo: number;

  @Column()
  public winner: number;

  @Column()
  public score: number[];
}

export default Match;
