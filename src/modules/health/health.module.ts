import { UsersModule } from './../users/users.module';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';

@Module({
  imports: [TerminusModule, UsersModule],
  controllers: [HealthController],
  providers: [],
})
export class HealthModule {}
