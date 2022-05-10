import { BadRequestExceptionCustom } from './../../@core/exceptions/bad-request.exception';
import { LogInDto } from './dto/logIn.dto';
import { Injectable } from '@nestjs/common';
import RegisterDto from './dto/register.dto';
import { MongoError } from './../../@core/constants';
import {
  InternalServerExceptionCustom,
  NotFoundExceptionCustom,
  UnAuthorizedExceptionCustom,
} from './../../@core/exceptions';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/schemas/user.schema';
import { config } from 'src/@core/config';
@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) { }

  public async register(registrationData: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    try {
      const createdUser = await this.usersService.create({
        ...registrationData,
        password: hashedPassword,
      });
      createdUser.password = undefined;
      return createdUser;
    } catch (error) {
      if (error?.code === MongoError.DuplicateKey) {
        throw new UnAuthorizedExceptionCustom(
          'User with that email already exists',
        );
      }
      throw new InternalServerExceptionCustom();
    }
  }
  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      const user = await this.usersService.findByEmail(email);
      await this.verifyPassword(plainTextPassword, user.password);

      user.password = undefined;
      return user;
    } catch (error) {
      throw new UnAuthorizedExceptionCustom('Wrong credentials provided');
    }
  }
  async login(user: User) {
    try {
      console.log(user)
      const payload: TokenPayload = { userId: user._id.toString() };

      return {
        access_token: this.jwtService.sign(payload,
          {
            secret: config.jwt.secret,
            expiresIn: config.jwt.expireTime
          }),
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
      throw new UnAuthorizedExceptionCustom(
        'Wrong credentials provided',
      );
    }
  }
  async logout() {
    try {

    } catch (error) {

    }
  }
}
