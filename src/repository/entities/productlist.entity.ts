import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { Cart } from './cart.entity';
import { Products } from './products.entity';
@Entity('productList', { schema: 'public' })
export class ProductList {
  @Column('text', { primary: true, name: 'idProductList' })
  idProductList: string;

  @ManyToOne(() => Cart, (cart) => cart.productLists)
  @JoinColumn([{ name: 'idCart', referencedColumnName: 'idCart' }])
  idCart: Cart;

  @ManyToOne(() => Products, (products) => products.productLists)
  @JoinColumn([{ name: 'idProduct', referencedColumnName: 'idProduct' }])
  idProduct: Products;
}
