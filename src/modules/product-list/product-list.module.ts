import { Module } from '@nestjs/common';
import { ProductListService } from './product-list.service';
import { ProductListController } from './product-list.controller';
import { ProductList } from 'src/repository/entities/productlist.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ProductList])],
  controllers: [ProductListController],
  providers: [ProductListService],
})
export class ProductListModule {}
