import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../database/prisma.service';
import { RoleType, UserStatus } from '@prisma/client';
import { JwtPayload } from '@goshashi/types';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async registerCustomer(data: {
    name: string;
    email: string;
    mobile: string;
    password: string;
    referralCode?: string;
  }) {
    // Check if email or mobile already registered
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { mobile: data.mobile }],
      },
    });

    if (existing) {
      if (existing.email === data.email) {
        throw new ConflictException('Email is already registered');
      }
      throw new ConflictException('Mobile number is already registered');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    // Create User, Customer profile, and assign CUSTOMER role in transaction
    const user = await this.prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          mobile: data.mobile,
          passwordHash,
          status: UserStatus.ACTIVE,
          isMobileVerified: false,
        },
      });

      // Role assignment
      const customerRole = await tx.role.findUnique({
        where: { name: RoleType.CUSTOMER },
      });
      if (customerRole) {
        await tx.userRole.create({
          data: {
            userId: newUser.id,
            roleId: customerRole.id,
          },
        });
      }

      // Customer profile
      const newReferral = 'GS' + Math.random().toString(36).substring(2, 8).toUpperCase();
      await tx.customer.create({
        data: {
          userId: newUser.id,
          referralCode: newReferral,
          referredBy: data.referralCode,
        },
      });

      return newUser;
    });

    return this.generateTokens(user.id, user.email, [RoleType.CUSTOMER]);
  }

  async login(identifier: string, pass: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { mobile: identifier }],
      },
      include: {
        userRoles: { include: { role: true } },
        customer: true,
        partner: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status === UserStatus.BLOCKED) {
      throw new UnauthorizedException('Account has been suspended');
    }

    const isValid = await bcrypt.compare(pass, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const roles = user.userRoles.map((ur) => ur.role.name);
    return this.generateTokens(
      user.id,
      user.email,
      roles,
      user.customer?.id,
      user.partner?.id,
    );
  }

  async refreshToken(userId: string, incomingRefreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: { include: { role: true } },
        customer: true,
        partner: true,
      },
    });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Access denied');
    }

    const tokenMatches = await bcrypt.compare(incomingRefreshToken, user.refreshToken);
    if (!tokenMatches) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const roles = user.userRoles.map((ur) => ur.role.name);
    return this.generateTokens(
      user.id,
      user.email,
      roles,
      user.customer?.id,
      user.partner?.id,
    );
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
    return { success: true };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        status: true,
        isMobileVerified: true,
        isEmailVerified: true,
        userRoles: { select: { role: { select: { name: true } } } },
        customer: { select: { id: true, referralCode: true } },
        partner: { select: { id: true, businessName: true, kycStatus: true, isAvailable: true } },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      roles: user.userRoles.map((r) => r.role.name),
      customer: user.customer,
      partner: user.partner,
    };
  }

  private async generateTokens(
    userId: string,
    email: string,
    roles: RoleType[],
    customerId?: string,
    partnerId?: string,
  ) {
    const payload: JwtPayload = {
      sub: userId,
      email,
      roles: roles as unknown as any,
      customerId,
      partnerId,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET || 'goshashi-super-secret-jwt-access-key-minimum-32-chars',
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'goshashi-super-secret-jwt-refresh-key-minimum-32-chars',
      expiresIn: '7d',
    });

    // Hash refresh token in DB for rotation security
    const hashedRefresh = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefresh },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: userId,
        email,
        roles,
        customerId,
        partnerId,
      },
    };
  }
}
