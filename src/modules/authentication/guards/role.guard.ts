import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { Role } from 'src/@core/constants';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import JwtAuthenticationGuard from './jwt-authentication.guard';

const RoleGuard = (roles: Array<Role>): Type<CanActivate> => {
  class RoleGuardMixin extends JwtAuthenticationGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const user = request.user;
      // return user?.role == role;
      return roles.includes(user?.role);
    }
  }

  return mixin(RoleGuardMixin);
};

export default RoleGuard;
