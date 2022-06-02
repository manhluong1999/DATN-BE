import { UsersService } from './../users/users.service';
import { Controller, Get } from '@nestjs/common';
import { HealthCheck } from '@nestjs/terminus';

@Controller()
export class HealthController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @HealthCheck()
  async check(): Promise<'ok' | 'ng'> {
    try {
      await this.usersService.findAll({});
      return 'ok';
    } catch (error) {
      return 'ng';
    }
  }
}
