import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';

import { JwtAuthGuard } from '../admin/guards/jwt-auth.guard';
import { RolesGuard } from '../admin/guards/roles.guard';
import { Roles } from '../admin/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
} from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 🔥 1️⃣ GET MY PROFILE (Any authenticated user)
  @Get('me')
  @ApiOperation({ summary: 'Get logged-in user profile' })
  getProfile(@Request() req) {
    return this.usersService.findById(req.user.sub);
  }

  // 🔥 2️⃣ GET ALL USERS (Admin only)
  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  getAllUsers() {
    return this.usersService.findAll();
  }

  // 🔥 3️⃣ GET USER BY ID (Admin only)
  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get user by ID (Admin only)' })
  getUserById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  // 🔥 4️⃣ UPDATE USER ROLE (Admin only)
  @Patch(':id/role')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update user role (Admin only)' })
  updateRole(
    @Param('id') id: string,
    @Body('role') role: Role,
  ) {
    return this.usersService.updateRole(id, role);
  }

  // 🔥 5️⃣ DELETE USER (Admin only)
  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}