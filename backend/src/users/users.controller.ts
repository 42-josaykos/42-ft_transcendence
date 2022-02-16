import { Controller, Get } from '@nestjs/common';

@Controller('api')
export class UsersController {
  @Get('users')
  getUsers(): any {
    return [
      { id: 0, name: 'user-0' },
      { id: 1, name: 'user-1' },
    ];
  }
}
