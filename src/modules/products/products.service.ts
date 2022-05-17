import { CreateProductDto, UpdateProductDto } from './product.dto';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';
import { ApiResponse } from '../../common/config/apiresponse';
import { Products } from '../../repository/entities/products.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
  ) {}
  async getAllProducts(): Promise<ApiResponse<Products[]>> {
    const products: Products[] = await this.productsRepository.find();
    return ApiResponse(
      HttpStatus.OK,
      'Products retrieved successfully',
      products,
    );
  }

  async getProductById(id: string): Promise<ApiResponse<Products>> {
    const product = await this.productsRepository.findOne(id);
    if (product) {
      return ApiResponse(
        HttpStatus.OK,
        'Product retrieved successfully',
        product,
      );
    }
    return ApiResponse(HttpStatus.NOT_FOUND, 'Product not found');
  }

  async createProduct(
    product: CreateProductDto,
  ): Promise<ApiResponse<Products>> {
    const userEntity = ProductsService.dtoToEntity(product);
    userEntity.idProduct = randomUUID();
    const productResponse = await this.productsRepository.save(userEntity);
    return ApiResponse(
      HttpStatus.CREATED,
      'Product created successfully',
      productResponse,
    );
  }

  async updateProduct(
    id: string,
    product: UpdateProductDto,
  ): Promise<ApiResponse<Products>> {
    const result = await this.productsRepository.findOne(id);
    if (result) {
      const productEntity = ProductsService.dtoToEntity(product);
      productEntity.idProduct = id;
      const productResponse = await this.productsRepository.save(productEntity);
      return ApiResponse(
        HttpStatus.OK,
        'Product updated successfully',
        productResponse,
      );
    }
    return ApiResponse(HttpStatus.NOT_FOUND, 'Product not found');
  }

  async deleteProduct(id: string): Promise<ApiResponse<Products>> {
    const result = await this.productsRepository.findOne(id);
    if (result) {
      await this.productsRepository.delete(id);
      return ApiResponse(HttpStatus.OK, 'Product deleted successfully');
    }
    return ApiResponse(HttpStatus.NOT_FOUND, 'Product not found');
  }
  static dtoToEntity<T, U>(dto: T): Products {
    const data = instanceToPlain(dto);
    return plainToClass(Products, data);
  }
}
