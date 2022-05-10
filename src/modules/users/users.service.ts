import { FindByEmailDto } from './dto/findOne.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import CreateUserDto from './dto/createUser.dto';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateUserDto } from './dto/updateUser.dto';
import { BadRequestExceptionCustom, NotFoundExceptionCustom } from 'src/@core/exceptions';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) { }

  async getById(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundExceptionCustom('USER NOT FOUND');
    }
    return user;
  }

  async create(userData: CreateUserDto) {
    const createdUser = new this.userModel(userData);
    return createdUser.save();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find();
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    if (user) {
      return user;
    }
    throw new NotFoundExceptionCustom('User with this email does not exist')
  }

}
