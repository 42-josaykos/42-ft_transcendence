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
  public id: number;

  @Column()
  public name: string;

  @Column({ nullable: true })
  public password: string;

  @ManyToOne((type) => User, (user) => user.ownerChannels, {
    eager: true,
    cascade: true,
  })
  public owner: User;

  // @ManyToMany((type) => User, (administrators) => administrators.channels)
  // // @JoinTable()
  // public administrators: User[];

  @ManyToMany((type) => User, (user) => user.membersChannels, {
    eager: true,
    cascade: true,
  })
  //   @JoinTable()
  public members: User[];

  // @ManyToMany((type) => User, (bans) => bans.channels)
  // //   @JoinTable()
  // public bans: User[];
}

export default Channel;
