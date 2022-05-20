import { Controller, Get, Param } from '@nestjs/common';
import { ProductListService } from './product-list.service';

@Controller('product-list')
export class ProductListController {
  constructor(private readonly productListService: ProductListService) {}

  @Get('/:idProduct')
  async findAllById(@Param('idProduct') idProduct: string): Promise<any> {
    return this.productListService.findAll(idProduct);
  }
}
