import { ProductListModule } from './../product-list/product-list.module';
import { forwardRef, Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from '../../repository/entities/products.entity';
import { ProductsResolver } from './products.resolver';

@Module({
  imports: [ProductListModule, TypeOrmModule.forFeature([Products])],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsResolver],
})
export class ProductsModule {}
