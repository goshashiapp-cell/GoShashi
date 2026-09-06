import { Module } from '@nestjs/common';
import { PartnerController } from './partner.controller';
import { PartnerService } from './partner.service';
import { OrdersModule } from '../orders/orders.module';
import { PrismaService } from '../../database/prisma.service';

@Module({
  imports: [OrdersModule],
  controllers: [PartnerController],
  providers: [PartnerService, PrismaService],
  exports: [PartnerService],
})
export class PartnerModule {}
