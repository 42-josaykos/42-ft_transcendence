import type { User } from './user.model'
import type { Message } from './message.model'

export interface Channel {
    id: number;
    name: string;
    isPrivate: boolean;
    isProtected: boolean;
    isDirectChannel: boolean;
    password: string;
    messages: Message[];
    owner: User;
    admins: User[];
    members: User[];
    mutes: User[];
    bans: User[];
    invites: User[];
    isMember: boolean;
    isOwner: boolean;
}