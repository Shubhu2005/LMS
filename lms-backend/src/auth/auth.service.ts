
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

  //-------------generate token-------//
  async generateTokens(user: any) {
  const payload = {
    sub: user._id,
    role: user.role,
    firstName: user.firstName,
  };

  const accessToken = this.jwtService.sign(payload, {
    secret: process.env.JWT_ACCESS_SECRET,
    expiresIn: '15m',
  });

  const refreshToken = this.jwtService.sign(payload, {
    secret: process.env.JWT_REFRESH_SECRET,
    expiresIn: '7d',
  });

  const hashedRefresh = await bcrypt.hash(refreshToken, 12);

  await this.usersService.updateRefreshToken(user._id, hashedRefresh);

  return { accessToken, refreshToken };
}


//-------------Refersh token----//
async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.usersService.findById(payload.sub);

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException();
      }

      const isMatch = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );

      if (!isMatch) {
        throw new UnauthorizedException();
      }

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
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

  //----logout-----//

    async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
    return { message: 'Logged out successfully' };
  }

}