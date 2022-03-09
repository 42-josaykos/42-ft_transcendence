import User from 'src/api/users/entities/user.entity';
import { UserDetails } from 'src/utils/types';

export interface AuthenticationProvider {
  validateUser(details: UserDetails);
  validateUserGithub(details: UserDetails);
  createUser(details: UserDetails);
  findUser(student_id: string): Promise<User | undefined>;
}
