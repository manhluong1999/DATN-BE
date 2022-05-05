import { Public } from './../../@core/constants/decorators.constants';
import { GUARDS } from './../../@core/constants/guards.enum';
import { LogInDto } from './dto/logIn.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import RegisterDto from './dto/register.dto';
import { ApiSecurity } from '@nestjs/swagger';

@ApiSecurity('authorization')
@Controller()
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}
  @Public([GUARDS.AUTH_GUARD])
  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData);
  }
  @Public([GUARDS.AUTH_GUARD])
  @Post('login')
  async login( @Body() loginData : LogInDto) {
    return this.authenticationService.login(loginData)
  }

  @Public([GUARDS.AUTH_GUARD])
  @Post('logout')
  async logout() {
    return this.authenticationService.logout()
  }
}
