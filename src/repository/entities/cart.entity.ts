import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Users } from './users.entity';
import { ProductList } from './productlist.entity';

@Index('cart_pkey', ['idCart'], { unique: true })
@Entity('cart', { schema: 'public' })
export class Cart {
  @Column('text', { primary: true, name: 'idCart' })
  idCart: string;

  @Column('date', { name: 'date' })
  date: string;

  @Column('integer', { name: 'quantity' })
  quantity: number;

  @Column('text', { name: 'idProductList' })
  idProductList: string;

  @ManyToOne(() => Users, (users) => users.carts)
  @JoinColumn([{ name: 'idUser', referencedColumnName: 'idUser' }])
  idUser: Users;

  @OneToMany(() => ProductList, (productList) => productList.idCart)
  productLists: ProductList[];
}
