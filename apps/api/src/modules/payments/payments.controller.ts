import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createPayment(
    @CurrentUser('customerId') customerId: string,
    @Body('orderId') orderId: string,
  ) {
    return this.paymentsService.createPayment(orderId, customerId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verifyPayment(
    @Body()
    body: {
      orderId: string;
      gatewayOrderId: string;
      gatewayPaymentId: string;
      gatewaySignature: string;
    },
  ) {
    return this.paymentsService.verifyPayment(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':orderId')
  async getPayment(@Param('orderId') orderId: string) {
    return this.paymentsService.getPaymentByOrderId(orderId);
  }
}
