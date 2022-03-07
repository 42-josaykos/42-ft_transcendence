import  type { User } from './user.model'

export interface Message {
    id: number;
    author: User;
    data: string;
    channel: number;
}