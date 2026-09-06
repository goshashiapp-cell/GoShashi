import { Controller, Get, Param, Query } from '@nestjs/common';
import { CatalogService } from './catalog.service';

@Controller()
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('categories')
  async getCategories() {
    return this.catalogService.getCategories();
  }

  @Get('categories/:slug')
  async getCategoryBySlug(@Param('slug') slug: string) {
    return this.catalogService.getCategoryBySlug(slug);
  }

  @Get('services')
  async getServices(
    @Query('category') categorySlug?: string,
    @Query('search') search?: string,
    @Query('featured') featured?: boolean,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.catalogService.getServices({
      categorySlug,
      search,
      featured,
      page,
      limit,
    });
  }

  @Get('services/:slug')
  async getServiceBySlug(@Param('slug') slug: string) {
    return this.catalogService.getServiceBySlug(slug);
  }

  @Get('banners')
  async getBanners() {
    return this.catalogService.getBanners();
  }
}
