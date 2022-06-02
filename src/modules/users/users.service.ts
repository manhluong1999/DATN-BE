import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import CreateUserDto from './dto/createUser.dto';
import { FilterQuery, Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateUserDto } from './dto/updateUser.dto';
import {
  BadRequestExceptionCustom,
  InternalServerExceptionCustom,
  NotFoundExceptionCustom,
  UnAuthorizedExceptionCustom,
} from 'src/@core/exceptions';
import { MongoError, Role } from 'src/@core/constants';
import { LawyerDetailService } from '../lawyer_details/lawyer-detail.service';
import CreateLawyerDto from '../lawyer_details/dtos/createLawyer.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly lawyerDetailsService: LawyerDetailService,
  ) {}

  async getById(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundExceptionCustom('USER NOT FOUND');
    }
    return user;
  }

  public async createUser(userData: CreateLawyerDto | CreateUserDto) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    try {
      console.log(userData);
      const createdUser = await this.create({
        ...userData,
        password: hashedPassword,
      });
      if (userData.role == Role.Lawyer) {
        this.lawyerDetailsService.create(userData);
      }
      return createdUser;
    } catch (error) {
      if (error?.code === MongoError.DuplicateKey) {
        throw new UnAuthorizedExceptionCustom(
          'User with that email already exists',
        );
      }
      throw new InternalServerExceptionCustom();
    }
  }

  async create(userData: CreateUserDto) {
    const createdUser = new this.userModel(userData);
    return createdUser.save();
  }

  async findAll(filter: FilterQuery<UserDocument>): Promise<UserDocument[]> {
    return this.userModel.find(filter);
  }

  async updateUser() {}
  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.getById(userId);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async setCurrentRefreshToken(refreshToken: string, userId: string) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    const user = await this.userModel
      .findByIdAndUpdate(userId, { currentHashedRefreshToken })
      .setOptions({ overwrite: false });

    if (!user) {
      throw new NotFoundExceptionCustom('USER NOT FOUND');
    }
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    if (user) {
      return user;
    }
    throw new NotFoundExceptionCustom('User with this email does not exist');
  }
}
