import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from 'src/api/users/entities/user.entity';
import MutedUser from 'src/api/users/entities/muted.user.entity';
import BanedUser from 'src/api/users/entities/baned.user.entity';
import Message from 'src/api/messages/entities/message.entity';

@Entity()
class Channel {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column({ nullable: true, default: false })
  public isPrivate: boolean;

  @Column({ nullable: true, default: false })
  public isProtected: boolean;

  @Column({ nullable: true, select: false })
  public password: string;

  @OneToMany((type) => Message, (message) => message.channel, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  public messages: Message[];

  @ManyToOne((type) => User, (user) => user.ownerChannels, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  public owner: User;

  @ManyToMany((type) => User, (admin) => admin.adminChannels, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinTable()
  public admins: User[];

  @ManyToMany((type) => User, (user) => user.memberChannels, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinTable()
  public members: User[];

  @OneToMany((type) => MutedUser, (mutes) => mutes.channel, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  public mutes: MutedUser[];

  @OneToMany((type) => BanedUser, (bans) => bans.channel, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  public bans: BanedUser[];

  @ManyToMany((type) => User, (bans) => bans.inviteChannels, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinTable()
  public invites: User[];
}

export default Channel;
