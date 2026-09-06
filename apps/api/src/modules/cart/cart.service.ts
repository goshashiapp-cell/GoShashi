import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(customerId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { customerId },
      include: {
        items: {
          include: {
            service: {
              include: { images: true },
            },
            addons: {
              include: { addon: true },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { customerId },
        include: {
          items: {
            include: {
              service: { include: { images: true } },
              addons: { include: { addon: true } },
            },
          },
        },
      });
    }

    // Recalculate price totals server-side
    let subtotal = 0;
    let addonsTotal = 0;

    cart.items.forEach((item) => {
      const price = item.service.salePrice ?? item.service.basePrice;
      subtotal += price * item.quantity;
      item.addons.forEach((ad) => {
        addonsTotal += ad.addon.price * item.quantity;
      });
    });

    const taxTotal = Number(((subtotal + addonsTotal) * 0.18).toFixed(2));
    const platformFee = 49.0;
    const finalTotal = subtotal + addonsTotal + taxTotal + platformFee;

    return {
      cart,
      summary: {
        subtotal,
        addonsTotal,
        taxTotal,
        platformFee,
        finalTotal,
        itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
      },
    };
  }

  async addToCart(
    customerId: string,
    data: {
      serviceId: string;
      quantity?: number;
      scheduledDate?: string;
      scheduledTime?: string;
      addressId?: string;
      notes?: string;
      addonIds?: string[];
    },
  ) {
    const service = await this.prisma.service.findUnique({
      where: { id: data.serviceId },
    });

    if (!service || !service.status) {
      throw new NotFoundException('Service unavailable or not found');
    }

    let cart = await this.prisma.cart.findUnique({
      where: { customerId },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { customerId },
      });
    }

    // Create cart item
    const item = await this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        serviceId: data.serviceId,
        quantity: data.quantity || 1,
        scheduledDate: data.scheduledDate ? new Date(data.scheduledDate) : null,
        scheduledTime: data.scheduledTime,
        addressId: data.addressId,
        notes: data.notes,
      },
    });

    // Link addons if provided
    if (data.addonIds && data.addonIds.length > 0) {
      for (const addonId of data.addonIds) {
        await this.prisma.cartItemAddon.create({
          data: {
            cartItemId: item.id,
            addonId,
          },
        });
      }
    }

    return this.getCart(customerId);
  }

  async removeItem(customerId: string, cartItemId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { customerId },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    await this.prisma.cartItem.deleteMany({
      where: { id: cartItemId, cartId: cart.id },
    });

    return this.getCart(customerId);
  }

  async clearCart(customerId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { customerId },
    });

    if (cart) {
      await this.prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    return this.getCart(customerId);
  }
}
