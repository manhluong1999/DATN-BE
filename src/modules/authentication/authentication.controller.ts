import { Body, Controller, Get, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import RegisterDto from './dto/register.dto';
import JwtAuthenticationGuard from './guards/jwt-authentication.guard';
import { LocalAuthenticationGuard } from './guards/localAuthentication.guard';
import RequestWithUser from './interfaces/requestWithUser.interface';

@Controller()
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) { }

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('log-in')
  async login(@Request() req: RequestWithUser) {
    return this.authenticationService.login(req.user)
  }

  @Post('log-out')
  async logout() {
    return this.authenticationService.logout()
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Request() request: RequestWithUser) {
    const user = request.user;
    // user.password = undefined;
    return user;
  }
}
