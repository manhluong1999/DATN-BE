import { Body, Controller, Get, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthenticationService } from './authentication.service';
import LogInDto from './dto/logIn.dto';
import RefreshTokenDto from './dto/refresh-token.dto';
import RegisterDto from './dto/register.dto';
import JwtAuthenticationGuard from './guards/jwt-authentication.guard';
import JwtRefreshTokenGuard from './guards/jwt-refresh-token-authentication.guard';
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
  @ApiBody({ type: LogInDto })
  @Post('log-in')
  async login(@Request() req: RequestWithUser) {
    return this.authenticationService.login(req.user)
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  @ApiBearerAuth('JWT')
  authenticate(@Request() request: RequestWithUser) {
    const user = request.user;
    return user;
  }

  @UseGuards(JwtRefreshTokenGuard)
  @ApiBody({
    type: RefreshTokenDto
  })
  @Post('refresh-token')
  refreshToken(@Request() request: RequestWithUser) {
    const user = request.user;
    const userId = user._id.toString()
    const payload: TokenPayload = { userId };
    const { accessToken, accessTokenExpiresAt } = this.authenticationService.getJwtAccessToken(payload)

    return {
      accessToken,
      accessTokenExpiresAt
    };
  }
}
