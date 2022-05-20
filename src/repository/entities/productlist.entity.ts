import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { Cart } from './cart.entity';
import { Products } from './products.entity';

@ObjectType()
@Entity('productList', { schema: 'public' })
export class ProductList {
  @Field()
  @Column('text', { primary: true, name: 'idProductList' })
  idProductList: string;

  @Field((type) => Cart)
  @ManyToOne(() => Cart, (cart) => cart.productLists, {
    eager: true,
  })
  @JoinColumn([{ name: 'idCart', referencedColumnName: 'idCart' }])
  idCart: Cart;

  @Field((type) => Products)
  @ManyToOne(() => Products, (products) => products.productLists, {
    eager: true,
  })
  @JoinColumn([{ name: 'idProduct', referencedColumnName: 'idProduct' }])
  idProduct: Products;
}
