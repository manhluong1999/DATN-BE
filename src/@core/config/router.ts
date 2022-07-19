import { HealthModule } from './../../modules/health/health.module';
import { UsersModule } from './../../modules/users/users.module';
import { Routes } from 'nest-router';
import { AuthenticationModule } from 'src/modules/authentication/authentication.module';
import { MeetingModule } from 'src/modules/meetings/meetings.module';
import { ChatModule } from 'src/modules/chat/chat.module';
import { NotifficationModule } from 'src/modules/notifications/notifications.module';
import { PaymentModule } from 'src/modules/payment/payment.module';

export const ROUTERS: Routes = [
  {
    path: '/api/v1',
    children: [
      {
        path: '/authentication',
        module: AuthenticationModule,
      },
      {
        path: '/users',
        module: UsersModule,
      },
      {
        path: '/meetings',
        module: MeetingModule,
      },
      {
        path: '/chat',
        module: ChatModule,
      },
      {
        path: '/notification',
        module: NotifficationModule,
      },
      {
        path: '/payment',
        module: PaymentModule,
      },
      {
        path: '/health',
        module: HealthModule,
      },
    ],
  },
];
