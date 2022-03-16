import { CreateUserDTO } from 'src/api/users/dto/create-user.dto';
import User from 'src/api/users/entities/user.entity';

export interface AuthenticationProvider {
  validateUser(details: CreateUserDTO);
  validateUserGithub(details: CreateUserDTO);
  validateUserLocal(username: string, plainPassword: string);
  createUser(details: CreateUserDTO);
  findUser(id: number): Promise<User | undefined>;
}

export type Done = (err: Error, user: User) => void;
