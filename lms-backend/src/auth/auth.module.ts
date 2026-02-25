// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'library_jwt_secret_key_2024',
      signOptions: { expiresIn: '7d' }, // Token valid for 7 days
    }),
  ],
  providers: [AuthService, JwtStrategy,JwtRefreshStrategy],
  controllers: [AuthController],
})
export class AuthModule {}