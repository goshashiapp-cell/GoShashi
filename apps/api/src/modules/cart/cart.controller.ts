import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@CurrentUser('customerId') customerId: string) {
    return this.cartService.getCart(customerId);
  }

  @Post('items')
  async addToCart(
    @CurrentUser('customerId') customerId: string,
    @Body()
    body: {
      serviceId: string;
      quantity?: number;
      scheduledDate?: string;
      scheduledTime?: string;
      addressId?: string;
      notes?: string;
      addonIds?: string[];
    },
  ) {
    return this.cartService.addToCart(customerId, body);
  }

  @Delete('items/:id')
  async removeItem(
    @CurrentUser('customerId') customerId: string,
    @Param('id') cartItemId: string,
  ) {
    return this.cartService.removeItem(customerId, cartItemId);
  }

  @Delete()
  async clearCart(@CurrentUser('customerId') customerId: string) {
    return this.cartService.clearCart(customerId);
  }
}
