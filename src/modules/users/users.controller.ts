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
  UploadedFile,
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
import {
  FileFieldsInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { FindLawyersDto } from './dto/findAllLawyer.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(RoleGuard([Role.Admin]))
  @ApiBearerAuth('JWT')
  @Get()
  async findAllUser() {
    return this.usersService.findAll({ role: Role.User });
  }

  @Get('lawyers')
  async findAllLawyer(
    @Query('status') status: UserStatus,
    @Body() data: FindLawyersDto,
  ) {
    return this.usersService.findAllLawyers(status, data);
  }

  @Get('lawyer')
  async findOneLawyer(@Query('id') id: string) {
    return this.usersService.findOneLawyer(id);
  }

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
    @Query('ratingScore') ratingScore?: number,
  ) {
    return this.usersService.approveLawyer(email, status, ratingScore);
  }

  @UseGuards(RoleGuard([Role.User, Role.Lawyer]))
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'evidenceUrls', maxCount: 2 },
      { name: 'imgUrl', maxCount: 1 },
    ]),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('JWT')
  @Put('update')
  async updateUser(
    @Req() request: RequestWithUser,
    @Body() updateLawyerDto: UpdateLawyerDto,
    @UploadedFiles()
    files: {
      evidenceUrls?: Express.Multer.File[];
      imgUrl?: Express.Multer.File[];
    },
  ) {
    console.log(updateLawyerDto);
    console.log(request.user);
    console.log(files);
    return this.usersService.updateUserInfo(
      request.user,
      updateLawyerDto,
      files,
    );
  }

  @UseGuards(RoleGuard([Role.Admin]))
  @ApiBearerAuth('JWT')
  @Delete()
  async deleteUser(@Query('email') email: string) {
    return this.usersService.deleteUser(email);
  }

  @UseGuards(RoleGuard([Role.Admin]))
  @ApiBearerAuth('JWT')
  @Delete('deleteAll')
  async deleteAllUser() {
    await this.usersService.deleteMany();
  }
}
