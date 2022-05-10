import { Controller } from '@nestjs/common';
import { ProductListService } from './product-list.service';

@Controller('product-list')
export class ProductListController {
  constructor(private readonly productListService: ProductListService) {}
}
