import { Column, Entity, Index, OneToMany } from 'typeorm';
import { ProductList } from './productlist.entity';
@Index('products_pkey', ['idProduct'], { unique: true })
@Entity('products', { schema: 'public' })
export class Products {
  @Column('text', { primary: true, name: 'idProduct' })
  idProduct: string;

  @Column('text', { name: 'productName' })
  productName: string;

  @Column('text', { name: 'description' })
  description: string;

  @Column('double precision', { name: 'price', precision: 53 })
  price: number;

  @Column('integer', { name: 'stock' })
  stock: number;

  @OneToMany(() => ProductList, (productList) => productList.idProduct)
  productLists: ProductList[];
}
