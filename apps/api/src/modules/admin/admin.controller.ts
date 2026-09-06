import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RoleType, KycStatus, OrderStatus } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleType.ADMIN, RoleType.SUPER_ADMIN, RoleType.OPERATIONS)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  async getDashboard() {
    return this.adminService.getDashboardMetrics();
  }

  @Get('customers')
  async getCustomers(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.adminService.getCustomers({ page, limit, search });
  }

  @Get('partners')
  async getPartners(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') kycStatus?: KycStatus,
    @Query('search') search?: string,
  ) {
    return this.adminService.getPartners({ page, limit, kycStatus, search });
  }

  @Put('partners/:id/kyc')
  async updatePartnerKyc(
    @Param('id') partnerId: string,
    @CurrentUser('sub') adminUserId: string,
    @Body('status') status: KycStatus,
    @Body('reason') reason?: string,
  ) {
    return this.adminService.updatePartnerKyc(partnerId, status, adminUserId, reason);
  }

  @Get('orders')
  async getOrders(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: OrderStatus,
  ) {
    return this.adminService.getOrders({ page, limit, status });
  }

  @Get('audit-logs')
  async getAuditLogs() {
    return this.adminService.getAuditLogs();
  }
}
