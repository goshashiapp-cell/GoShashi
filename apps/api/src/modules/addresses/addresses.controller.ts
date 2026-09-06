import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  async getAddresses(@CurrentUser('customerId') customerId: string) {
    return this.addressesService.getAddresses(customerId);
  }

  @Post()
  async createAddress(
    @CurrentUser('customerId') customerId: string,
    @Body() body: any,
  ) {
    return this.addressesService.createAddress(customerId, body);
  }

  @Delete(':id')
  async deleteAddress(
    @CurrentUser('customerId') customerId: string,
    @Param('id') id: string,
  ) {
    return this.addressesService.deleteAddress(customerId, id);
  }
}
