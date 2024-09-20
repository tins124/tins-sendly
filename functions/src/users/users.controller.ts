import { Controller, Get, Session, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Session() session: Record<string, any>) {
    const username = session.username;
    if (username) {
      const response = await this.usersService.getUser(username);
      return { message: 'Get ptofile successfully!', data: response };
    }
    return { message: 'Please login before get information!', data: null };
  }
}
