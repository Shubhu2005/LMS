// src/users/users.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(data: {
    firstName: string;
    email: string;
    password: string;
    role: Role;
  }): Promise<UserDocument> {
    const existing = await this.userModel.findOne({ email: data.email });
    if (existing) {
      throw new ConflictException('Email is already registered');
    }

    const user = new this.userModel(data);
    return user.save();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase() });
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id);
  }

  async findAll(): Promise<Partial<UserDocument>[]> {
    return this.userModel.find().select('-password').lean();
  }


  async updateRefreshToken(
  userId: string,
  refreshToken: string | null,
): Promise<void> {
  const user = await this.userModel.findById(userId);

  if (!user) {
    throw new NotFoundException('User not found');
  }

  user.refreshToken = refreshToken ?? undefined;
  await user.save();
}

async updateRole(userId: string, role: Role) {
  return this.userModel.findByIdAndUpdate(
    userId,
    { role },
    { new: true },
  );
}

async deleteUser(userId: string) {
  const user = await this.userModel.findByIdAndDelete(userId);

  if (!user) {
    throw new NotFoundException('User not found');
  }

  return {
    message: 'User deleted successfully',
  };
}

}