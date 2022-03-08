import { InjectRepository } from '@nestjs/typeorm';
import { UserDetails } from 'src/utils/types';
import { Repository } from 'typeorm';
import { AuthenticationProvider } from './auth.interface';
import User from 'src/api/users/entities/user.entity';
import { Inject, Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { Done } from 'src/utils/types';

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

  findUser(student_id: string) {
    return this.userRepo.findOne({ student_id });
  }
}

/**
 * Handle session store in DB
 */

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authService: AuthenticationProvider,
  ) {
    super();
  }

  serializeUser(user: User, done: Done) {
    done(null, user);
  }

  async deserializeUser(user: User, done: Done) {
    const userDB = await this.authService.findUser(user.student_id);
    return userDB ? done(null, userDB) : done(null, null);
  }
}
