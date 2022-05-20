import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ReturningStatementNotSupportedError } from 'typeorm';
import { ApiResponse } from '../../common/config/apiresponse';
import { ProductList } from '../../repository/entities/productlist.entity';

@Injectable()
export class ProductListService {
  constructor(
    @InjectRepository(ProductList)
    private productsListRepository: Repository<ProductList>,
  ) {}

  async findAll(idProduct: string): Promise<ProductList[]> {
    const productList = await this.productsListRepository.find({
      where: { idProduct },
    });
    return productList;
  }

  // async findAll(idProduct: string): Promise<ProductList[]> {
  //   return this.productsRepository.find({
  //     where: { idProduct },
  //   });
  // }
}
