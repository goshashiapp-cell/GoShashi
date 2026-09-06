import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../database/prisma.service';
import { OrdersService } from '../orders/orders.service';
import { RoleType, UserStatus, KycStatus, OrderStatus } from '@prisma/client';
import { BUSINESS_CONFIG } from '@goshashi/config';

@Injectable()
export class PartnerService {
  constructor(
    private prisma: PrismaService,
    private ordersService: OrdersService,
  ) {}

  async registerPartner(data: {
    name: string;
    email: string;
    mobile: string;
    password: string;
    businessName?: string;
    businessType?: string;
    experienceYears?: number;
    categoryIds: string[];
    serviceRadiusKm?: number;
    city: string;
    state: string;
    pincode: string;
    panNumber: string;
  }) {
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { mobile: data.mobile }],
      },
    });

    if (existing) {
      throw new ConflictException('Email or mobile number is already registered');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          mobile: data.mobile,
          passwordHash,
          status: UserStatus.ACTIVE,
        },
      });

      const partnerRole = await tx.role.findUnique({
        where: { name: RoleType.PARTNER },
      });
      if (partnerRole) {
        await tx.userRole.create({
          data: { userId: user.id, roleId: partnerRole.id },
        });
      }

      const partner = await tx.partner.create({
        data: {
          userId: user.id,
          businessName: data.businessName || data.name,
          businessType: data.businessType || 'INDIVIDUAL',
          experienceYears: data.experienceYears || 1,
          serviceRadiusKm: data.serviceRadiusKm || 10.0,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          kycStatus: KycStatus.PENDING,
        },
      });

      // Link PAN Document
      await tx.partnerDocument.create({
        data: {
          partnerId: partner.id,
          documentType: 'PAN',
          documentNo: data.panNumber,
          fileUrl: 'https://placehold.co/600x400?text=PAN+Document',
          status: KycStatus.PENDING,
        },
      });

      // Link services belonging to selected categories
      const services = await tx.service.findMany({
        where: { categoryId: { in: data.categoryIds } },
      });

      for (const s of services) {
        await tx.partnerService.create({
          data: { partnerId: partner.id, serviceId: s.id },
        });
      }

      return {
        success: true,
        message: 'Partner registration submitted for KYC verification',
        partnerId: partner.id,
      };
    });
  }

  async getProfile(partnerId: string) {
    const partner = await this.prisma.partner.findUnique({
      where: { id: partnerId },
      include: {
        user: { select: { name: true, email: true, mobile: true } },
        documents: true,
        services: { include: { service: true } },
      },
    });

    if (!partner) {
      throw new NotFoundException('Partner profile not found');
    }

    return partner;
  }

  async updateAvailability(partnerId: string, isAvailable: boolean) {
    return this.prisma.partner.update({
      where: { id: partnerId },
      data: { isAvailable },
    });
  }

  async getJobs(partnerId: string) {
    return this.prisma.order.findMany({
      where: { partnerId },
      orderBy: { scheduledDate: 'desc' },
      include: {
        items: true,
        address: true,
        customer: { include: { user: { select: { name: true, mobile: true } } } },
      },
    });
  }

  async acceptJob(partnerId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, partnerId },
    });

    if (!order) {
      throw new NotFoundException('Job not found or not assigned to you');
    }

    return this.ordersService.transitionStatus(
      orderId,
      OrderStatus.ACCEPTED,
      partnerId,
      'Partner accepted the dispatched job',
    );
  }

  async rejectJob(partnerId: string, orderId: string, reason?: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, partnerId },
    });

    if (!order) {
      throw new NotFoundException('Job not found');
    }

    // Unassign and set back to SEARCHING_PARTNER
    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        partnerId: null,
        status: OrderStatus.SEARCHING_PARTNER,
      },
    });

    await this.prisma.orderStatusHistory.create({
      data: {
        orderId,
        oldStatus: order.status,
        newStatus: OrderStatus.SEARCHING_PARTNER,
        changedBy: partnerId,
        reason: reason || 'Partner declined job',
      },
    });

    return { success: true, message: 'Job rejected and returned to pool' };
  }

  async markArrived(partnerId: string, orderId: string) {
    return this.ordersService.transitionStatus(
      orderId,
      OrderStatus.ARRIVED,
      partnerId,
      'Partner arrived at customer location',
    );
  }

  async startJob(partnerId: string, orderId: string) {
    return this.ordersService.transitionStatus(
      orderId,
      OrderStatus.IN_PROGRESS,
      partnerId,
      'Service started by partner',
    );
  }

  async completeJob(
    partnerId: string,
    orderId: string,
    data: {
      completionNotes?: string;
      beforePhotos?: string[];
      afterPhotos?: string[];
    },
  ) {
    const updatedOrder = await this.ordersService.transitionStatus(
      orderId,
      OrderStatus.COMPLETED,
      partnerId,
      'Service successfully completed by partner',
      data,
    );

    // Increment partner completed jobs count
    await this.prisma.partner.update({
      where: { id: partnerId },
      data: { completedJobsCount: { increment: 1 } },
    });

    return updatedOrder;
  }

  async getEarnings(partnerId: string) {
    const completedOrders = await this.prisma.order.findMany({
      where: {
        partnerId,
        status: OrderStatus.COMPLETED,
      },
      select: {
        finalTotal: true,
        taxTotal: true,
        platformFee: true,
        createdAt: true,
      },
    });

    let grossEarnings = 0;
    completedOrders.forEach((o) => {
      grossEarnings += o.finalTotal - o.taxTotal - o.platformFee;
    });

    const commissionRate = BUSINESS_CONFIG.DEFAULT_COMMISSION_PERCENTAGE;
    const platformCommission = (grossEarnings * commissionRate) / 100;
    const netEarnings = grossEarnings - platformCommission;

    const payouts = await this.prisma.payout.findMany({
      where: { partnerId },
    });

    const paidAmount = payouts
      .filter((p) => p.status === 'COMPLETED')
      .reduce((sum, p) => sum + p.amount, 0);

    const pendingPayout = payouts
      .filter((p) => p.status === 'PENDING')
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      grossEarnings: Number(grossEarnings.toFixed(2)),
      platformCommission: Number(platformCommission.toFixed(2)),
      commissionPercentage: commissionRate,
      netEarnings: Number(netEarnings.toFixed(2)),
      withdrawableBalance: Number(Math.max(0, netEarnings - paidAmount - pendingPayout).toFixed(2)),
      paidAmount: Number(paidAmount.toFixed(2)),
      completedJobs: completedOrders.length,
    };
  }
}
