import { Controller, Get, Req, Session, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Req() request: Request) {
    // console.log(session);
    const username = request.cookies['username'];
    if (username) {
      const response = await this.usersService.getUser(username);
      return { message: 'Get ptofile successfully!', data: response };
    }
    return {
      message: "Please login before get user's information!",
      data: null,
    };
  }
}
