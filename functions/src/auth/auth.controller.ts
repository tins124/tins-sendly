import { Body, Controller, Post, Session } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-in')
  async signIn(
    @Body() signInDTO: Record<string, any>,
    @Session() session: Record<string, any>,
  ) {
    if (session.access_token) {
      return session.access_token;
    }
    const response = await this.authService.signIn(
      signInDTO.username,
      signInDTO.password,
    );
    session.access_token = response.access_token;
    return { message: 'Sign in successfully!', username: response.username };
  }

  @Post('sign-up')
  async signUp(@Body() signUpDTO: Record<string, any>) {
    return this.authService.signUp(signUpDTO.username, signUpDTO.password);
  }
}
