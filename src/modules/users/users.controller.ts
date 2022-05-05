import { UpdateUserDto } from './dto/updateUser.dto';
import { GUARDS } from './../../@core/constants/guards.enum';
import { Public } from './../../@core/constants/decorators.constants';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Put, } from '@nestjs/common';
import { UsersService } from './users.service';

@ApiBearerAuth('JWT')
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Public([GUARDS.PUBLIC_GUARD])
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Public([GUARDS.PUBLIC_GUARD])
  @Get(':email')
  async findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

}
