import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
class User {
  // @PrimaryGeneratedColumn()
  // private id: number;

  @PrimaryColumn()
  public login: string;
}

export default User;
