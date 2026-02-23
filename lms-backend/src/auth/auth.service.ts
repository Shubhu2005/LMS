// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // ── Register ──────────────────────────────────────────────────────────
  async register(dto: RegisterDto) {
    // Hash the password before saving to MongoDB
    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = await this.usersService.create({
      firstName: dto.firstName,
      email: dto.email,
      password: hashedPassword,
      role: dto.role,
    });

    const token = this.signToken(
      (user._id as any).toString(),
      user.email,
      user.role,
      user.firstName,
    );

    return {
      message: 'Registration successful',
      user: {
        id: user._id,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
        createdAt: (user as any).createdAt,
      },
      access_token: token,
    };
  }

  // ── Login ─────────────────────────────────────────────────────────────
  async login(dto: LoginDto) {
    // 1. Find user by email
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 2. Compare hashed password
    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 3. Sign & return JWT
    const token = this.signToken(
      (user._id as any).toString(),
      user.email,
      user.role,
      user.firstName,
    );

    return {
      message: 'Login successful',
      user: {
        id: user._id,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
      },
      access_token: token,
    };
  }

  // ── JWT helper ────────────────────────────────────────────────────────
  private signToken(
    id: string,
    email: string,
    role: Role,
    firstName: string,
  ): string {
    return this.jwtService.sign({ sub: id, email, role, firstName });
  }
}