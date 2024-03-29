import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { Role } from 'src/@core/constants';
import { UsersService } from '../users/users.service';
import { AuthenticationService } from './authentication.service';
import ChangePasswordDto from './dto/change-password.dto';
import LogInDto from './dto/logIn.dto';
import RefreshTokenDto from './dto/refresh-token.dto';
import RegisterDto from './dto/register.dto';
import JwtAuthenticationGuard from './guards/jwt-authentication.guard';
import JwtRefreshTokenGuard from './guards/jwt-refresh-token-authentication.guard';
import { LocalAuthenticationGuard } from './guards/localAuthentication.guard';
import RequestWithUser from './interfaces/requestWithUser.interface';

@Controller()
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly userService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @ApiBody({ type: LogInDto })
  @Post('log-in')
  async login(@Request() req: RequestWithUser) {
    return this.authenticationService.login(req.user);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  @ApiBearerAuth('JWT')
  async authenticate(@Request() request: RequestWithUser) {
    const user = request.user;
    if (user.role == Role.Lawyer) {
      const data = await this.userService.lawyerDetailsService.findByEmail(
        user.email,
      );
      return {
        id: user._id,
        _id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        imgUrl: user.imgUrl,
        socketId: user.socketId,
        balance: user.balance,
        fullName: user.fullName,
        phone: user.phone,
        address: user.address,
        status: user.status,
        majorFields: data.majorFields,
        description: data.description,
        ratingScore: data.ratingScore,
        yearExperiences: data.yearExperiences,
        evidenceUrls: data.evidenceUrls,
      };
    }
    return user;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Put('change-password')
  @ApiBearerAuth('JWT')
  async changePassword(
    @Request() request: RequestWithUser,
    @Body() body: ChangePasswordDto,
  ) {
    const user = request.user;
    return await this.authenticationService.changePassword(user, body);
  }

  @UseGuards(JwtRefreshTokenGuard)
  @ApiBody({
    type: RefreshTokenDto,
  })
  @Post('refresh-token')
  refreshToken(@Request() request: RequestWithUser) {
    const user = request.user;
    const userId = user._id.toString();
    const payload: TokenPayload = { userId };
    const { accessToken, accessTokenExpiresAt } =
      this.authenticationService.getJwtAccessToken(payload);

    return {
      accessToken,
      accessTokenExpiresAt,
    };
  }
}
