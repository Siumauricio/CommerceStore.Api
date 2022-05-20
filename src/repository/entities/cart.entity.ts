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
import { Field, ObjectType } from '@nestjs/graphql';
@ObjectType()
@Index('cart_pkey', ['idCart'], { unique: true })
@Entity('cart', { schema: 'public' })
export class Cart {
  @Field()
  @Column('text', { primary: true, name: 'idCart' })
  idCart: string;

  @Field()
  @Column('date', { name: 'date' })
  date: string;

  @Field()
  @Column('integer', { name: 'quantity' })
  quantity: number;

  @Field()
  @Column('text', { name: 'idProductList' })
  idProductList: string;

  @Field(() => Users)
  @ManyToOne(() => Users, (users) => users.carts)
  @JoinColumn([{ name: 'idUser', referencedColumnName: 'idUser' }])
  idUser: Users;

  @Field(() => [ProductList])
  @OneToMany(() => ProductList, (productList) => productList.idCart)
  productLists: ProductList[];
}
