import { BadRequestExceptionCustom } from './../../../@core/exceptions/bad-request.exception';
import { User } from './../../users/schemas/user.schema';
import { NotFoundExceptionCustom } from './../../../@core/exceptions/not-found.exception';
import { UsersService } from './../../users/users.service';
import { UnAuthorizedExceptionCustom } from './../../../@core/exceptions/un-authorize.exception';
import { DECORATORS } from './../../../@core/constants/decorators.constants';
import { GUARDS } from './../../../@core/constants/guards.enum';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthenticationService } from '../authentication.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger('AuthGuard');

  constructor(
    private readonly reflector: Reflector,
    private readonly authenticationService: AuthenticationService,
    private readonly usersService: UsersService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.logger.log(
      '[Come Auth Guard...]',
      `Auth Guard/${context.getClass().name}`,
    );
    const publicGuards: GUARDS[] = this.reflector.get<GUARDS[]>(
      DECORATORS.IS_PUBLIC_GUARD,
      context.getHandler(),
    );

    if (publicGuards?.includes(GUARDS.AUTH_GUARD)) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    if (!request?.headers['authorization']) {
      throw new UnAuthorizedExceptionCustom();
    }

    request.user = await this.validateToken(
      request?.headers['authorization'].replace(/^Bearer\s+/, ""),
    );

    return true;
  }

  async validateToken(token: string) {
    try {

    } catch (err) {
      console.log('AUTH GUARD ERROR', JSON.stringify(err));
      let message = 'TOKEN ERROR: ' + (err.message || err.name);
      if (
        err?.response?.code === 'auth/user-not-found' ||
        err?.code === 'auth/user-not-found'
      ) {
        message = 'USER_NOT_FOUND';
      }

      throw new BadRequestExceptionCustom(message);
    }
  }
}
