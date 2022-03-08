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

  @Column({ nullable: true, default: false })
  public isPrivate: boolean;

  @Column({ nullable: true })
  public password: string;

  @ManyToOne((type) => User, (user) => user.ownerChannels, {
    // eager: true,
    cascade: true,
  })
  public owner: User;

  @ManyToMany((type) => User, (admin) => admin.adminChannels, {
    // eager: true,
    cascade: true,
  })
  @JoinTable()
  public admins: User[];

  @ManyToMany((type) => User, (user) => user.memberChannels, {
    // eager: true,
    cascade: true,
  })
  @JoinTable()
  public members: User[];

  @ManyToMany((type) => User, (bans) => bans.muteChannels)
  @JoinTable()
  public mutes: User[];

  @ManyToMany((type) => User, (bans) => bans.banChannels)
  @JoinTable()
  public bans: User[];
}

export default Channel;
