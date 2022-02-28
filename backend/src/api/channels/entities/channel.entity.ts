import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from 'src/api/users/entities/user.entity';

@Entity()
class Channel {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @ManyToOne((type) => User)
  public owner: User;

  @OneToMany((type) => User, (moderators) => moderators.id)
  public moderators: User[];

  @OneToMany((type) => User, (members) => members.id)
  public members: User[];

  @OneToMany((type) => User, (bans) => bans.id)
  public bans: User[];
}

export default Channel;
