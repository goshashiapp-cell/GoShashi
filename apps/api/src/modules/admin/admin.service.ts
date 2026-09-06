import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { KycStatus, UserStatus, OrderStatus, RoleType } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardMetrics() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalCustomers,
      totalPartners,
      pendingKycCount,
      todayBookingsCount,
      revenueResult,
      activeOrdersCount,
      completedOrdersCount,
      cancelledOrdersCount,
    ] = await Promise.all([
      this.prisma.customer.count(),
      this.prisma.partner.count({ where: { kycStatus: KycStatus.APPROVED } }),
      this.prisma.partner.count({ where: { kycStatus: KycStatus.PENDING } }),
      this.prisma.order.count({ where: { createdAt: { gte: today } } }),
      this.prisma.order.aggregate({
        where: { status: OrderStatus.COMPLETED },
        _sum: { finalTotal: true, platformFee: true },
      }),
      this.prisma.order.count({
        where: {
          status: {
            in: [
              OrderStatus.CONFIRMED,
              OrderStatus.SEARCHING_PARTNER,
              OrderStatus.ASSIGNED,
              OrderStatus.ACCEPTED,
              OrderStatus.ON_THE_WAY,
              OrderStatus.ARRIVED,
              OrderStatus.IN_PROGRESS,
            ],
          },
        },
      }),
      this.prisma.order.count({ where: { status: OrderStatus.COMPLETED } }),
      this.prisma.order.count({ where: { status: OrderStatus.CANCELLED } }),
    ]);

    const totalRevenue = revenueResult._sum.finalTotal || 0;
    const platformCommissionEarned = (totalRevenue * 0.15) + (revenueResult._sum.platformFee || 0);

    return {
      totalCustomers,
      activePartners: totalPartners,
      pendingKyc: pendingKycCount,
      todayBookings: todayBookingsCount,
      activeOrders: activeOrdersCount,
      completedOrders: completedOrdersCount,
      cancelledOrders: cancelledOrdersCount,
      grossMarketplaceValue: Number(totalRevenue.toFixed(2)),
      platformRevenue: Number(platformCommissionEarned.toFixed(2)),
    };
  }

  async getCustomers(query: { page?: number; limit?: number; search?: string }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.search) {
      where.user = {
        OR: [
          { name: { contains: query.search } },
          { email: { contains: query.search } },
          { mobile: { contains: query.search } },
        ],
      };
    }

    const [customers, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              mobile: true,
              status: true,
              createdAt: true,
            },
          },
          _count: {
            select: { orders: true, reviews: true },
          },
        },
      }),
      this.prisma.customer.count({ where }),
    ]);

    return {
      data: customers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getPartners(query: {
    page?: number;
    limit?: number;
    kycStatus?: KycStatus;
    search?: string;
  }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.kycStatus) {
      where.kycStatus = query.kycStatus;
    }
    if (query.search) {
      where.OR = [
        { businessName: { contains: query.search } },
        { user: { name: { contains: query.search } } },
        { user: { mobile: { contains: query.search } } },
      ];
    }

    const [partners, total] = await Promise.all([
      this.prisma.partner.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              mobile: true,
              status: true,
            },
          },
          documents: true,
        },
      }),
      this.prisma.partner.count({ where }),
    ]);

    return {
      data: partners,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updatePartnerKyc(
    partnerId: string,
    status: KycStatus,
    adminUserId: string,
    reason?: string,
  ) {
    const partner = await this.prisma.partner.findUnique({
      where: { id: partnerId },
    });

    if (!partner) {
      throw new NotFoundException('Partner not found');
    }

    const updated = await this.prisma.partner.update({
      where: { id: partnerId },
      data: {
        kycStatus: status,
        kycRejectionReason: status === KycStatus.REJECTED ? reason : null,
      },
    });

    // Create Audit Log
    await this.prisma.auditLog.create({
      data: {
        userId: adminUserId,
        action: 'partner.kyc_updated',
        entity: 'Partner',
        entityId: partnerId,
        oldValue: partner.kycStatus,
        newValue: status,
      },
    });

    return updated;
  }

  async getOrders(query: {
    page?: number;
    limit?: number;
    status?: OrderStatus;
  }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.status) {
      where.status = query.status;
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: { include: { user: { select: { name: true, mobile: true } } } },
          partner: { include: { user: { select: { name: true, mobile: true } } } },
          items: true,
          payment: true,
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getAuditLogs() {
    return this.prisma.auditLog.findMany({
      take: 50,
      orderBy: { timestamp: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
      },
    });
  }
}
