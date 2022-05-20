import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { ProductList } from './productlist.entity';

@ObjectType()
@Index('products_pkey', ['idProduct'], { unique: true })
@Entity('products', { schema: 'public' })
export class Products {
  @Field()
  @Column('text', { primary: true, name: 'idProduct' })
  idProduct: string;

  @Field()
  @Column('text', { name: 'productName' })
  productName: string;

  @Field()
  @Column('text', { name: 'description' })
  description: string;

  @Field()
  @Column('double precision', { name: 'price', precision: 53 })
  price: number;

  @Field()
  @Column('integer', { name: 'stock' })
  stock: number;

  @Field((field) => [ProductList])
  @OneToMany(() => ProductList, (productList) => productList.idProduct)
  productLists: ProductList[];
}
export class MockProducts extends Products {
  constructor() {
    super();
    this.idProduct = '';
    this.productName = '';
    this.description = '';
    this.price = 0;
    this.stock = 0;
    this.productLists = [];
  }
}
