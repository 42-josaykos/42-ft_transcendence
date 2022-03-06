import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDetails } from 'src/utils/types';
import { Repository } from 'typeorm';
import { AuthenticationProvider } from './auth';
import User from 'src/api/users/entities/user.entity';

/**
 * Create a new student user if not found in database
 */

@Injectable()
export class AuthService implements AuthenticationProvider {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async validateUser(details: UserDetails) {
    const { student_id } = details;
    const user = await this.userRepo.findOne({ student_id });
    console.log(user);

    if (user) return user;
    return await this.createUser(details);
  }

  createUser(details: UserDetails) {
    console.log('Creating User');
    const user = this.userRepo.create(details);
    return this.userRepo.save(user);
  }

  findUser() {
    return;
  }
}
