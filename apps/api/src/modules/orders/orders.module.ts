import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { PartnerMatchingService } from './partner-matching.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, PartnerMatchingService, PrismaService],
  exports: [OrdersService, PartnerMatchingService],
})
export class OrdersModule {}
