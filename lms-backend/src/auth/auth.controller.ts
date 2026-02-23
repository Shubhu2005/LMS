// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../admin/guards/jwt-auth.guard';
import { RolesGuard } from '../admin/guards/roles.guard';
import { Roles } from '../admin/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  // ─── PUBLIC ROUTES ────────────────────────────────────────────────────

  /**
   * POST /auth/register
   * Anyone can register with role: student | manager | admin
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  /**
   * POST /auth/login
   * Returns JWT token on success
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // ─── PROTECTED ROUTES (JWT required) ──────────────────────────────────

  /**
   * GET /auth/profile
   * Any authenticated user can view their own profile
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return {
      message: 'Profile fetched successfully',
      user: req.user,
    };
  }

  // ─── ROLE-BASED PROTECTED ROUTES ──────────────────────────────────────

  /**
   * GET /auth/student-dashboard
   * Accessible by: student, manager, admin
   */
  @Get('student-dashboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.STUDENT, Role.MANAGER, Role.ADMIN)
  studentDashboard(@Request() req) {
    return {
      message: `Welcome to Student Dashboard, ${req.user.firstName}!`,
      data: {
        availableBooks: 120,
        borrowedBooks: 3,
        dueSoon: 1,
      },
    };
  }

  /**
   * GET /auth/manager-dashboard
   * Accessible by: manager, admin
   */
  @Get('manager-dashboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MANAGER, Role.ADMIN)
  managerDashboard(@Request() req) {
    return {
      message: `Welcome to Manager Dashboard, ${req.user.firstName}!`,
      data: {
        totalBooks: 500,
        issuedToday: 15,
        overdueReturns: 4,
        activeMembers: 200,
      },
    };
  }

  /**
   * GET /auth/admin-dashboard
   * Accessible by: admin only
   */
  @Get('admin-dashboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  adminDashboard(@Request() req) {
    return {
      message: `Welcome to Admin Dashboard, ${req.user.firstName}!`,
      data: {
        totalUsers: 350,
        totalBooks: 500,
        systemHealth: 'OK',
        serverUptime: '99.8%',
      },
    };
  }

  /**
   * GET /auth/users
   * Accessible by: admin only — view all registered users
   */
  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  getAllUsers() {
    return this.usersService.findAll();
  }
}