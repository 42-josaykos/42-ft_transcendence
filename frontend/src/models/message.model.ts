import  type { User } from './user.model'
import  type { Channel } from './channel.model'

export interface Message {
    id: number;
    author: User;
    data: string;
    channel: number;
}