import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  Session,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-in')
  @HttpCode(200)
  async signIn(
    @Body() signInDTO: Record<string, any>,
    @Session() session: Record<string, any>,
    @Res({ passthrough: true }) response: Response,
  ) {
    // if (request.cookies['access_token']) {
    //   return request.cookies['access_token'];
    // }
    const result = await this.authService.signIn(
      signInDTO.username,
      signInDTO.password,
    );
    session.username = result.username;
    response.cookie('access_token', result.access_token, {
      maxAge: 3600000,
      httpOnly: false,
      secure: true,
      sameSite: 'none',
    });
    return {
      message: 'Sign in successfully!',
      username: result.username,
      access_token: result.access_token,
    };
  }

  @Post('sign-up')
  @HttpCode(201)
  async signUp(@Body() signUpDTO: Record<string, any>) {
    return this.authService.signUp(signUpDTO.username, signUpDTO.password);
  }
}
