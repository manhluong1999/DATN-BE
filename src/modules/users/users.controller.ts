import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import JwtAuthenticationGuard from '../authentication/guards/jwt-authentication.guard';
import RoleGuard from '../authentication/guards/role.guard';
import { Role, UserStatus } from 'src/@core/constants';
import CreateUserDto from './dto/createUser.dto';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import CreateLawyerDto from '../lawyer_details/dtos/createLawyer.dto';
import UpdateLawyerDto from '../lawyer_details/dtos/updateLawyer.dto';
import RequestWithUser from '../authentication/interfaces/requestWithUser.interface';
import { validateFileUpload } from 'src/@core/utils/validateFile';
import { FilesInterceptor } from '@nestjs/platform-express';

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
  // @ApiBearerAuth('JWT')
  @Get('lawyer')
  async findAllLawyer(@Query('status') status: UserStatus) {
    return this.usersService.findAllLawyers(status);
  }

  // @UseGuards(RoleGuard([Role.Admin]))
  // @ApiBearerAuth('JWT')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiConsumes('multipart/form-data')
  @Post('lawyer')
  async createLawyer(
    @Body() createLawyerDto: CreateLawyerDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    validateFileUpload(files);
    console.log(files.length);
    return this.usersService.createUser(
      {
        ...createLawyerDto,
        role: Role.Lawyer,
      },
      files,
    );
  }

  @UseGuards(RoleGuard([Role.Admin]))
  @ApiBearerAuth('JWT')
  @Put('lawyer/approve')
  async approveLawyer(
    @Query('email') email: string,
    @Query('status') status: UserStatus,
  ) {
    return this.usersService.approveLawyer(email, status);
  }

  @UseGuards(RoleGuard([Role.Admin, Role.Lawyer]))
  @ApiBearerAuth('JWT')
  @Put('lawyer')
  async updateLawyer(@Body() updateLawyerDto: UpdateLawyerDto) {
    return this.usersService.updateLawyer(updateLawyerDto);
  }

  @UseGuards(RoleGuard([Role.User, Role.Lawyer]))
  @ApiBearerAuth('JWT')
  @Put()
  async updateUser(@Req() request: RequestWithUser) {
    console.log(request.user);
    return request.user;
  }

  @UseGuards(RoleGuard([Role.Admin]))
  @ApiBearerAuth('JWT')
  @Delete()
  async deleteUser(@Query('email') email: string) {
    return this.usersService.deleteUser(email);
  }
}
