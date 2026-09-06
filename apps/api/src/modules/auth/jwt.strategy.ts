import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../database/prisma.service';
import { JwtPayload } from '@goshashi/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'goshashi-super-secret-jwt-access-key-minimum-32-chars',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        userRoles: { include: { role: true } },
        customer: true,
        partner: true,
      },
    });

    if (!user || user.status === 'BLOCKED') {
      throw new UnauthorizedException('User account inactive or invalid');
    }

    return {
      sub: user.id,
      email: user.email,
      roles: user.userRoles.map((ur) => ur.role.name),
      customerId: user.customer?.id,
      partnerId: user.partner?.id,
    };
  }
}
