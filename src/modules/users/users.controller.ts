import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import JwtAuthenticationGuard from '../authentication/guards/jwt-authentication.guard';
import RoleGuard from '../authentication/guards/role.guard';
import { Role } from 'src/@core/constants';
import CreateUserDto from './dto/createUser.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(RoleGuard(Role.Admin))
  @ApiBearerAuth('JWT')
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(RoleGuard(Role.Admin))
  @ApiBearerAuth('JWT')
  @Post()
  async createLawyer(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser({
      ...createUserDto,
      role: Role.Lawyer,
    });
  }
}
