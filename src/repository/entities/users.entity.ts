import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Cart } from './cart.entity';

@ObjectType()
@Index('users_pkey', ['idUser'], { unique: true })
@Entity('users', { schema: 'public' })
export class Users {
  @Field()
  @Column('text', { primary: true, name: 'idUser' })
  idUser: string;

  @Field()
  @Column('text', { name: 'name' })
  name: string;

  @Field()
  @Column('text', { name: 'lastname' })
  lastname: string;

  @Field()
  @Column('text', { name: 'username' })
  username: string;

  @Field()
  @Column('integer', { name: 'age' })
  age: number;

  @Field()
  @Column('text', { name: 'email' })
  email: string;

  @Field({ nullable: true })
  @Column('text', { name: 'phoneNumber', nullable: true })
  phoneNumber: string | null;

  @Field()
  @Column('text', { name: 'userType' })
  userType: string;

  @Field()
  @Column('text', { name: 'password' })
  password: string;

  @Field((type) => [Cart])
  @OneToMany(() => Cart, (cart) => cart.idUser)
  carts: Cart[];
}
