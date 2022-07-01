import { HealthModule } from './health/health.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { UsersModule } from './users/users.module';
import { LawyerDetailModule } from './lawyer_details/lawyer-detail.module';
import { MeetingModule } from './meetings/meetings.module';
import { ChatModule } from './chat/chat.module';

export const MODULES = [
  AuthenticationModule,
  UsersModule,
  HealthModule,
  LawyerDetailModule,
  MeetingModule,
  ChatModule,
];
