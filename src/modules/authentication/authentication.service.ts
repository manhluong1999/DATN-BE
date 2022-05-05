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

@Injectable()
export class AuthenticationService {
  constructor(private readonly usersService: UsersService) {}

  public async register(registrationData: RegisterDto) {
    try {

    } catch (error) {
      if (error?.code === MongoError.DuplicateKey) {
        throw new UnAuthorizedExceptionCustom(
          'User with that email already exists',
        );
      }
      throw new InternalServerExceptionCustom();
    }
  }

  async login(loginData: LogInDto) {
    try {
      const { email, password } = loginData;
      const checkUser = await this.usersService.findByEmail(email);

      if (!checkUser) {
        throw new NotFoundExceptionCustom('User not found');
      }
      
    } catch (error) {
      throw new BadRequestExceptionCustom();
    }
  }
  async verifyTokenId(token: string) {
    try {

    } catch (error) {
      throw new BadRequestExceptionCustom();
    }
  }

  async logout() {
    try {

    } catch (error) {
      
    }
  }
}
