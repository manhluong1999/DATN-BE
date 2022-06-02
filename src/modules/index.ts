import { HealthModule } from './health/health.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { UsersModule } from './users/users.module';
import { LawyerDetailModule } from './lawyer_details/lawyer-detail.module';

export const MODULES = [
  AuthenticationModule,
  UsersModule,
  HealthModule,
  LawyerDetailModule,
];
