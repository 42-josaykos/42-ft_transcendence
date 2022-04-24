import type { Channel } from './channel.model'

export interface User {
  id: number;
  username: string;
  avatar?: string;
  ownerChannels: Channel[];
  adminChannels: Channel[];
  memberChannels: Channel[];
  muteChannels: MutedUser[];
  banChannels: BanedUser[];
  inviteChannels: Channel[];
}

export interface BanedUser {
  user: User;
  channel: Channel;
  date: Date;
  time?: string;
}

export interface MutedUser {
  user: User;
  channel: Channel;
  date: Date;
  time?: string;
}