import { BadRequestExceptionCustom } from './../../@core/exceptions/bad-request.exception';
import { LogInDto } from './dto/logIn.dto';
import { Injectable } from '@nestjs/common';
import RegisterDto from './dto/register.dto';
import { MongoError } from './../../@core/constants';
import {
  InternalServerExceptionCustom,
  UnAuthorizedExceptionCustom,
} from './../../@core/exceptions';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/schemas/user.schema';
import { config } from 'src/@core/config';
import { getTime } from 'date-fns';
import CreateUserDto from '../users/dto/createUser.dto';
@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  public async saveSocketId(socketId: string, userId: string) {
    await this.usersService.saveSocketIdByUserId(userId, socketId);
  }
  public async register(registrationData: CreateUserDto) {
    registrationData.role = undefined;
    return this.usersService.createUser(registrationData);
  }
  public async getUserFromAuthenticationToken(token: string) {
    const payload: TokenPayload = this.jwtService.verify(token, {
      secret: config.jwt.access_token_secret,
    });
    if (payload.userId) {
      return this.usersService.getById(payload.userId);
    }
    return null;
  }

  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      const user = await this.usersService.findByEmail(email);
      await this.verifyPassword(plainTextPassword, user.password);

      return user;
    } catch (error) {
      throw new UnAuthorizedExceptionCustom('Wrong credentials provided');
    }
  }
  public async login(user: User) {
    try {
      const userId = user._id.toString();
      const payload: TokenPayload = { userId };
      const { accessToken, accessTokenExpiresAt } =
        this.getJwtAccessToken(payload);

      const { refreshToken, refreshTokenExpiresAt } =
        this.getJwtRefreshToken(payload);

      await this.usersService.setCurrentRefreshToken(refreshToken, userId);

      return {
        accessToken,
        refreshToken,
        accessTokenExpiresAt,
        refreshTokenExpiresAt,
      };
    } catch (error) {
      throw new BadRequestExceptionCustom();
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new UnAuthorizedExceptionCustom('Wrong credentials provided');
    }
  }
  getJwtAccessToken(payload: TokenPayload) {
    const accessToken = this.jwtService.sign(payload, {
      secret: config.jwt.access_token_secret,
      expiresIn: config.jwt.access_token_expireTime,
    });
    return {
      accessToken,
      accessTokenExpiresAt:
        getTime(new Date()) +
        Number(config.jwt.access_token_expireTime.slice(0, -1)) * 1000, // 3600s
    };
  }
  getJwtRefreshToken(payload: TokenPayload) {
    const refreshToken = this.jwtService.sign(payload, {
      secret: config.jwt.refresh_token_secret,
      expiresIn: config.jwt.refresh_token_expireTime,
    });
    return {
      refreshToken,
      refreshTokenExpiresAt:
        getTime(new Date()) +
        Number(config.jwt.refresh_token_expireTime.slice(0, -1)) * 86400000, // 7 days
    };
  }
}
