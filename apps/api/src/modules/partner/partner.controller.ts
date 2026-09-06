import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PartnerService } from './partner.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('partner')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Post('register')
  async registerPartner(@Body() body: any) {
    return this.partnerService.registerPartner(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@CurrentUser('partnerId') partnerId: string) {
    return this.partnerService.getProfile(partnerId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('availability')
  async updateAvailability(
    @CurrentUser('partnerId') partnerId: string,
    @Body('isAvailable') isAvailable: boolean,
  ) {
    return this.partnerService.updateAvailability(partnerId, isAvailable);
  }

  @UseGuards(JwtAuthGuard)
  @Get('jobs')
  async getJobs(@CurrentUser('partnerId') partnerId: string) {
    return this.partnerService.getJobs(partnerId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('jobs/:id/accept')
  async acceptJob(
    @CurrentUser('partnerId') partnerId: string,
    @Param('id') orderId: string,
  ) {
    return this.partnerService.acceptJob(partnerId, orderId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('jobs/:id/reject')
  async rejectJob(
    @CurrentUser('partnerId') partnerId: string,
    @Param('id') orderId: string,
    @Body('reason') reason?: string,
  ) {
    return this.partnerService.rejectJob(partnerId, orderId, reason);
  }

  @UseGuards(JwtAuthGuard)
  @Post('jobs/:id/arrived')
  async markArrived(
    @CurrentUser('partnerId') partnerId: string,
    @Param('id') orderId: string,
  ) {
    return this.partnerService.markArrived(partnerId, orderId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('jobs/:id/start')
  async startJob(
    @CurrentUser('partnerId') partnerId: string,
    @Param('id') orderId: string,
  ) {
    return this.partnerService.startJob(partnerId, orderId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('jobs/:id/complete')
  async completeJob(
    @CurrentUser('partnerId') partnerId: string,
    @Param('id') orderId: string,
    @Body() body: any,
  ) {
    return this.partnerService.completeJob(partnerId, orderId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('earnings')
  async getEarnings(@CurrentUser('partnerId') partnerId: string) {
    return this.partnerService.getEarnings(partnerId);
  }
}
