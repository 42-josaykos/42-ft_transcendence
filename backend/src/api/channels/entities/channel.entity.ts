import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from 'src/api/users/entities/user.entity';

@Entity()
class Channel {
  @PrimaryGeneratedColumn()
  @ManyToMany((type) => User, (user) => user.channels)
  public id: number;

  @Column()
  public name: string;

  @Column({ nullable: true })
  public password: string;

  @OneToOne((type) => User)
  @JoinColumn()
  public owner: User;

  //   @OneToMany((type) => User, (moderators) => moderators.id)
  //   @JoinTable()
  //   public moderators: User[];

  //   @OneToMany((type) => User, (members) => members.id)
  //   @JoinTable()
  //   public members: User[];

  //   @OneToMany((type) => User, (bans) => bans.id)
  //   @JoinTable()
  //   public bans: User[];
}

export default Channel;
