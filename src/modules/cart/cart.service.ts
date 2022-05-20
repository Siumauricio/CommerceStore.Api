import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiResponse } from '../../common/config/apiresponse';
import { Cart } from '../../repository/entities/cart.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private productsRepository: Repository<Cart>,
  ) {}

  async findAll(idUser: string): Promise<ApiResponse<Cart[]>> {
    const cart = await this.productsRepository.find({
      where: { idUser },
    });
    return ApiResponse(HttpStatus.OK, 'Carts retrieved successfully', cart);
  }
}
