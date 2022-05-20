import { forwardRef, Inject } from '@nestjs/common';
import {
  Args,
  Mutation,
  ObjectType,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import {
  QueryResponse,
  QueryResponseArray,
} from '../../common/config/apiresponse';
import { ProductList } from '../../repository/entities/productlist.entity';
import { Products } from '../../repository/entities/products.entity';
import { Users } from '../../repository/entities/users.entity';
import { ProductListService } from '../product-list/product-list.service';
import { CreateProductDto } from './product.dto';
import { ProductsService } from './products.service';

@ObjectType()
export class ProductResponse extends QueryResponse(Products) {} // Abstract class to cast generic to entity

@ObjectType()
export class ProductsResponseArray extends QueryResponseArray(Products) {} // Abstract class to cast generic to entity

@ObjectType()
export class ProductListResponseArray extends QueryResponseArray(ProductList) {} // Abstract class to cast generic to entity

// const pubSub = new PubSub();

@Resolver(() => Products)
export class ProductsResolver {
  private pubSub: PubSub;
  constructor(
    @Inject(ProductsService) private productsService: ProductsService,
    @Inject(ProductListService)
    private productListService: ProductListService,
  ) {
    this.pubSub = new PubSub();
  }

  @Query(() => ProductResponse)
  async productById(
    @Args('idProduct', { type: () => String }) idProduct: string,
  ) {
    return await this.productsService.getProductById(idProduct);
  }

  @Query(() => ProductsResponseArray)
  async allProducts() {
    return await this.productsService.getAllProducts();
  }

  @Mutation(() => ProductResponse)
  async insertProduct(
    @Args('product', { type: () => CreateProductDto })
    product: CreateProductDto,
  ) {
    console.log(product);
    const result = await this.productsService.createProduct(product);

    this.pubSub.publish('productAdded', { productAdded: result });
    return result;
  }
  @Subscription((returns) => ProductResponse)
  productAdded() {
    return this.pubSub.asyncIterator('productAdded');
  }
  @ResolveField()
  async productLists(@Parent() product: Products) {
    const { idProduct } = product;
    const result = await this.productListService.findAll(idProduct);
    return result;
  }
}
