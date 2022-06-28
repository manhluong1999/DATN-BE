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
    public readonly lawyerDetailsService: LawyerDetailService,
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
    console.log(userData);

    try {
      const dataCreateUser = {
        ...userData,
        password: hashedPassword,
      };
      userData.role == Role.Lawyer &&
        (dataCreateUser.status = UserStatus.PENDING);

      const createdUser = await this.create(dataCreateUser);

      if (userData.role == Role.Lawyer) {
        const evidenceUrls = [];
        await Promise.all(
          files.map(async (file) => {
            const fileName = file.originalname;
            const buffer = file.buffer;
            const filePath = `${createdUser._id}/evidences/eviden_${fileName}`;
            console.log(filePath);
            await this.firebaseStorageService.uploadImg(filePath, buffer);
            const url = await this.firebaseStorageService.getdownloadFile(
              filePath,
            );
            evidenceUrls.push(url);
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
      throw new InternalServerExceptionCustom(error);
    }
  }

  async updateUserInfo(
    user,
    userData: UpdateLawyerDto,
    files: {
      evidenceUrls?: Express.Multer.File[];
      imgUrl?: Express.Multer.File[];
    },
  ) {
    const filter = {
      email: user.email,
    };

    const dataUpdate: any = {
      email: user.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      address: userData.address,
    };
    if (files.imgUrl && files.imgUrl.length) {
      const fileName = files.imgUrl[0].originalname;
      const buffer = files.imgUrl[0].buffer;
      const filePath = `${user._id}/avatar/avatar_${fileName}`;
      console.log(filePath);
      await this.firebaseStorageService.uploadImg(filePath, buffer);
      const url = await this.firebaseStorageService.getdownloadFile(filePath);
      dataUpdate.imgUrl = url;
    }
    await this.userModel.updateOne(filter, dataUpdate);

    if (user.role == Role.Lawyer) {
      const dataUpdate: any = {
        ...userData,
        email: user.email,
      };
      const evidenceUrls = [];
      if (files.evidenceUrls && files.evidenceUrls.length == 2) {
        await Promise.all(
          files.evidenceUrls.map(async (file) => {
            const fileName = file.originalname;
            const buffer = file.buffer;
            const filePath = `${user._id}/evidences/eviden_${fileName}`;
            console.log(filePath);
            await this.firebaseStorageService.uploadImg(filePath, buffer);
            const url = await this.firebaseStorageService.getdownloadFile(
              filePath,
            );
            evidenceUrls.push(url);
          }),
        );
        dataUpdate.evidenceUrls = evidenceUrls;
      }
      await this.lawyerDetailsService.updateOne(dataUpdate);
    }

    return {
      isSuccess: true,
    };
  }
  async deleteMany() {
    this.lawyerDetailsService.deleteMany();
    await this.userModel.deleteMany({ role: Role.User });
    return await this.userModel.deleteMany({ role: Role.Lawyer });
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

  async approveLawyer(email, status, ratingScore: number) {
    const user = await this.userModel.findOne({ email });
    console.log(email);
    if (!user) {
      return {
        code: 404,
        message: 'Email Not Found',
      };
    }
    const updateData = { email, status };
    await this.userModel.updateOne({ email }, updateData);
    if (ratingScore) {
      await this.lawyerDetailsService.updateOne({ email, ratingScore });
    }
    return {
      isSuccess: true,
    };
  }
  async findAllLawyers(status) {
    const lawyers = await this.userModel
      .find({
        role: Role.Lawyer,
        status,
      })
      .exec();
    return Promise.all(
      lawyers.map(async (lawyer) => {
        const findDetail = await this.lawyerDetailsService.findByEmail(
          lawyer.email,
        );
        const res = {
          id: lawyer.id,
          email: lawyer.email,
          firstName: lawyer.firstName,
          lastName: lawyer.lastName,
          address: lawyer.address,
          phone: lawyer.phone,
          imgUrl: lawyer.imgUrl,
          fullName: `${lawyer.firstName} ${lawyer.lastName}`,
          description: findDetail?.description,
          majorFields: findDetail?.majorFields,
          ratingScore: findDetail?.ratingScore,
          userRatesScore: findDetail?.userRatesScore,
          yearExperiences: findDetail?.yearExperiences,
          evidenceUrls: findDetail?.evidenceUrls,
        };
        return res;
      }),
    );
  }

  async findOneLawyer(id) {
    const lawyer = await this.getById(id);

    const findDetail = await this.lawyerDetailsService.findByEmail(
      lawyer.email,
    );
    const res = {
      id: lawyer.id,
      email: lawyer.email,
      firstName: lawyer.firstName,
      lastName: lawyer.lastName,
      address: lawyer.address,
      phone: lawyer.phone,
      imgUrl: lawyer.imgUrl,
      fullName: `${lawyer.firstName} ${lawyer.lastName}`,
      description: findDetail?.description,
      majorFields: findDetail?.majorFields,
      ratingScore: findDetail?.ratingScore,
      userRatesScore: findDetail?.userRatesScore,
      yearExperiences: findDetail?.yearExperiences,
      evidenceUrls: findDetail?.evidenceUrls,
    };
    return res;
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    if (user) {
      return user;
    }
    throw new NotFoundExceptionCustom('User with this email does not exist');
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
}
