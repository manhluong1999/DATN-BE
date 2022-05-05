import { HealthModule } from './health/health.module';
import { AuthenticationModule } from "./authentication/authentication.module";
import { UsersModule } from "./users/users.module";

export const MODULES = [AuthenticationModule, UsersModule  , HealthModule];
