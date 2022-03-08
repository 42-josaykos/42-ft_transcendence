import User from 'src/api/users/entities/user.entity';

export type UserDetails = {
  student_id?: string;
  github_id?: string;
  username: string;
  avatar: string;
};

export type Done = (err: Error, user: User) => void;
