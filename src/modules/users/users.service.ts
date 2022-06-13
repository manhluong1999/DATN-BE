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
import { MongoError, Role, UserStatus } from 'src/@core/constants';
import { LawyerDetailService } from '../lawyer_details/lawyer-detail.service';
import CreateLawyerDto from '../lawyer_details/dtos/createLawyer.dto';
import UpdateLawyerDto from '../lawyer_details/dtos/updateLawyer.dto';
import { FirebaseStorageService } from '../firebase-storage/firebase-storage.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly lawyerDetailsService: LawyerDetailService,
    private readonly firebaseStorageService: FirebaseStorageService,
  ) {}

  async getById(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundExceptionCustom('USER NOT FOUND');
    }
    return user;
  }

  public async createUser(
    userData: CreateLawyerDto | CreateUserDto,
    files: Express.Multer.File[] = [],
  ) {
    const rawPassword =
      userData.password || Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(rawPassword, 10);
    try {
      const createdUser = await this.create({
        ...userData,
        password: hashedPassword,
      });
      if (userData.role == Role.Lawyer) {
        const evidenceUrls = [];
        await Promise.all(
          files.map(async (file) => {
            const fileName = file.originalname;
            const buffer = file.buffer;
            const filePath = `${createdUser._id}/${fileName}`;
            console.log(filePath);
            await this.firebaseStorageService.uploadImg(filePath, buffer);
            const url = await this.firebaseStorageService.getdownloadFile(
              filePath,
            );
            evidenceUrls.push(url);
            console.log(evidenceUrls);
          }),
        );
        await this.lawyerDetailsService.create({ ...userData, evidenceUrls });
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

  async updateLawyer(lawyerData: UpdateLawyerDto) {
    const filter = {
      email: lawyerData.email,
    };
    const user = await this.userModel.findOne(filter);
    if (!user) {
      throw new NotFoundExceptionCustom('user not found');
    }
    const dataUpdate = {
      firstName: lawyerData.firstName,
      lastName: lawyerData.lastName,
      phone: lawyerData.phone,
      address: lawyerData.address,
    };
    await this.userModel.updateOne(filter, dataUpdate);

    await this.lawyerDetailsService.updateOne(lawyerData);

    return {
      isSuccess: true,
    };
  }

  async deleteUser(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundExceptionCustom('user not found');
    }
    if (user.role == Role.Lawyer) {
      this.lawyerDetailsService.deleteOne(email);
    }
    this.userModel.deleteOne({ email });
    return {
      isSuccess: true,
    };
  }
  async create(userData: CreateUserDto) {
    const createdUser = new this.userModel(userData);
    return createdUser.save();
  }

  async findAll(filter: FilterQuery<UserDocument>): Promise<UserDocument[]> {
    return this.userModel.find(filter);
  }

  async findAllLawyers() {
    const lawyers = await this.userModel
      .find({
        role: Role.Lawyer,
        status: UserStatus.ACTIVE,
      })
      .exec();
    return Promise.all(
      lawyers.map(async (lawyer) => {
        const findDetail = await this.lawyerDetailsService.findByEmail(
          lawyer.email,
        );
        const res = {
          email: lawyer.email,
          firstName: lawyer.firstName,
          lastName: lawyer.lastName,
          address: lawyer.address,
          phone: lawyer.phone,
          fullName: `${lawyer.firstName} ${lawyer.lastName}`,
          description: findDetail.description,
          majorFields: findDetail.majorFields,
          ratingScore: findDetail.ratingScore,
          userRatesScore: findDetail.userRatesScore,
          yearExperiences: findDetail.yearExperiences,
        };
        return res;
      }),
    );
  }

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
