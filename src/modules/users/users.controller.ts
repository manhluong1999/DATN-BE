import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import JwtAuthenticationGuard from '../authentication/guards/jwt-authentication.guard';
import RoleGuard from '../authentication/guards/role.guard';
import { Role } from 'src/@core/constants';
import CreateUserDto from './dto/createUser.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import CreateLawyerDto from '../lawyer_details/dtos/createLawyer.dto';
import UpdateLawyerDto from '../lawyer_details/dtos/updateLawyer.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(RoleGuard([Role.Admin]))
  @ApiBearerAuth('JWT')
  @Get()
  async findAllUser() {
    return this.usersService.findAll({ role: Role.User });
  }

  // @UseGuards(RoleGuard([Role.Admin, Role.Lawyer]))
  @ApiBearerAuth('JWT')
  @Get('lawyer')
  async findAllLawyer() {
    return this.usersService.findAllLawyers();
  }

  @UseGuards(RoleGuard([Role.Admin]))
  @ApiBearerAuth('JWT')
  @Post('lawyer')
  async createLawyer(@Body() createLawyerDto: CreateLawyerDto) {
    return this.usersService.createUser({
      ...createLawyerDto,
      role: Role.Lawyer,
    });
  }

  @UseGuards(RoleGuard([Role.Admin, Role.Lawyer]))
  @ApiBearerAuth('JWT')
  @Put('lawyer')
  async updateUser(@Body() updateLawyerDto: UpdateLawyerDto) {
    return this.usersService.updateLawyer(updateLawyerDto);
  }

  @UseGuards(RoleGuard([Role.Admin]))
  @ApiBearerAuth('JWT')
  @Delete()
  async deleteUser(@Query('email') email: string) {
    return this.usersService.deleteUser(email);
  }
}
