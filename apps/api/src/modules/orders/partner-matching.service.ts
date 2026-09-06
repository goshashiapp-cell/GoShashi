import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { BUSINESS_CONFIG } from '@goshashi/config';
import { KycStatus } from '@prisma/client';

@Injectable()
export class PartnerMatchingService {
  constructor(private prisma: PrismaService) {}

  async findBestPartner(serviceId: string, city: string) {
    // 1. Find approved and available partners in this city offering this service
    const partners = await this.prisma.partner.findMany({
      where: {
        city: { equals: city },
        kycStatus: KycStatus.APPROVED,
        isAvailable: true,
        services: {
          some: { serviceId },
        },
      },
      include: {
        services: true,
      },
    });

    if (!partners || partners.length === 0) {
      return null;
    }

    const weights = BUSINESS_CONFIG.PARTNER_MATCHING_WEIGHTS;

    // 2. Score partners
    const scored = partners.map((partner) => {
      // Skill: 100% since service is present
      const skillScore = 100;

      // Rating: score normalized from 5.0 scale to 100
      const ratingScore = Math.min(100, (partner.rating / 5.0) * 100);

      // Availability: available flag is true
      const availabilityScore = partner.isAvailable ? 100 : 0;

      // Completion rate score: based on completed jobs
      const completionScore = Math.min(100, partner.completedJobsCount * 5);

      // Distance score: standard default inside city radius
      const distanceScore = 90;

      const totalScore =
        (skillScore * weights.SKILL +
          distanceScore * weights.DISTANCE +
          ratingScore * weights.RATING +
          availabilityScore * weights.AVAILABILITY +
          completionScore * weights.COMPLETION_RATE) /
        100;

      return {
        partner,
        totalScore,
      };
    });

    // Return highest scored partner
    scored.sort((a, b) => b.totalScore - a.totalScore);
    return scored[0]?.partner ?? null;
  }
}
