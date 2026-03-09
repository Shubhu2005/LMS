import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BorrowService } from './borrow.service';
import { JwtAuthGuard } from '../admin/guards/jwt-auth.guard';
import { RolesGuard } from '../admin/guards/roles.guard';
import { Roles } from '../admin/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';
@ApiTags('Borrow')
@ApiBearerAuth()
@Controller('borrow')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BorrowController {
  constructor(private readonly borrowService: BorrowService) {}

  // 🔥 USER → REQUEST BOOK
  @Post(':bookId')
  @Roles(Role.STUDENT)
  requestBook(@Param('bookId') bookId: string, @Request() req) {
    return this.borrowService.requestBook(bookId, req.user.sub);
  }

  // 🔥 USER → VIEW OWN BORROWS
  @Get('my')
  @Roles(Role.STUDENT)
  getMyBorrows(@Request() req) {
    return this.borrowService.getMyBorrows(req.user.sub);
  }

  // 🔥 MANAGER → VIEW PENDING
  @Get('pending')
  @Roles(Role.MANAGER, Role.ADMIN)
  getPending() {
    return this.borrowService.getPendingRequests();
  }

  // 🔥 MANAGER → APPROVE
  @Patch(':id/approve')
  @Roles(Role.MANAGER, Role.ADMIN)
  approve(@Param('id') id: string) {
    return this.borrowService.approveRequest(id);
  }

  // 🔥 MANAGER → DECLINE
  @Patch(':id/decline')
  @Roles(Role.MANAGER, Role.ADMIN)
  decline(@Param('id') id: string) {
    return this.borrowService.declineRequest(id);
  }

  // 🔥 MANAGER → RETURN
  @Patch(':id/return')
  @Roles(Role.MANAGER, Role.ADMIN)
  returnBook(@Param('id') id: string) {
    return this.borrowService.returnBook(id);
  }

  // 🔥 MANAGER → VIEW ALL
  @Get()
  @Roles(Role.MANAGER, Role.ADMIN)
  getAll() {
    return this.borrowService.getAllBorrows();
  }
}
