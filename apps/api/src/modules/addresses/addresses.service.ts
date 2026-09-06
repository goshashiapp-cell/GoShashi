import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AddressType } from '@prisma/client';

@Injectable()
export class AddressesService {
  constructor(private prisma: PrismaService) {}

  async getAddresses(customerId: string) {
    return this.prisma.address.findMany({
      where: { customerId },
      orderBy: { isDefault: 'desc' },
    });
  }

  async createAddress(
    customerId: string,
    data: {
      name: string;
      mobile: string;
      house: string;
      street: string;
      area: string;
      landmark?: string;
      city: string;
      state: string;
      pincode: string;
      addressType?: AddressType;
      isDefault?: boolean;
    },
  ) {
    if (data.isDefault) {
      await this.prisma.address.updateMany({
        where: { customerId },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.create({
      data: {
        customerId,
        name: data.name,
        mobile: data.mobile,
        house: data.house,
        street: data.street,
        area: data.area,
        landmark: data.landmark,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        addressType: data.addressType || AddressType.HOME,
        isDefault: data.isDefault || false,
      },
    });
  }

  async deleteAddress(customerId: string, addressId: string) {
    return this.prisma.address.deleteMany({
      where: { id: addressId, customerId },
    });
  }
}
