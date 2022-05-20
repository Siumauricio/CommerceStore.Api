import { Module } from '@nestjs/common';
import { ProductListService } from './product-list.service';
import { ProductListController } from './product-list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductList } from '../../repository/entities/productlist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductList])],
  controllers: [ProductListController],
  providers: [ProductListService],
  exports: [ProductListService],
})
export class ProductListModule {}
