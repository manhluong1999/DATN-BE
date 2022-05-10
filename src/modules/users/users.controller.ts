import { Body, Controller, Get, Param, Put, UseGuards, } from '@nestjs/common';
import { UsersService } from './users.service';
import JwtAuthenticationGuard from '../authentication/guards/jwt-authentication.guard';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':email')
  async findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

}
