import { BaseEntity, Column, Entity, Index, OneToMany } from 'typeorm';
import { Cart } from './cart.entity';
@Index('users_pkey', ['idUser'], { unique: true })
@Entity('users', { schema: 'public' })
export class Users {
  @Column('text', { primary: true, name: 'idUser' })
  idUser: string;

  @Column('text', { name: 'name' })
  name: string;

  @Column('text', { name: 'lastname' })
  lastname: string;

  @Column('text', { name: 'username' })
  username: string;

  @Column('integer', { name: 'age' })
  age: number;

  @Column('text', { name: 'email' })
  email: string;

  @Column('text', { name: 'phoneNumber', nullable: true })
  phoneNumber: string | null;

  @Column('text', { name: 'userType' })
  userType: string;

  @Column('text', { name: 'password' })
  password: string;

  @OneToMany(() => Cart, (cart) => cart.idUser)
  carts: Cart[];
}
