import type { User } from './user.model'
import type { Message } from './message.model'

export interface Channel {
    id: number;
    name: string;
    owner: User;
    messages: Message[];
}