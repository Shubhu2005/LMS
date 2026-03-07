// src/auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { ConfigService } from '@nestjs/config';
export interface JwtPayload {
  sub: string;       // MongoDB _id as string
  email: string;
  role: string;
  firstName: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService, private configService: ConfigService,) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
     console.log("JWT VALIDATE CALLED");
  console.log("Payload:", payload);
    // Verify user still exists in MongoDB
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }
    // This object becomes req.user in every protected route
    return {
      id: (user._id as any).toString(),
      sub: (user._id as any).toString(),
      email: user.email,
      role: user.role,
      firstName: user.firstName,
    };
  }
}