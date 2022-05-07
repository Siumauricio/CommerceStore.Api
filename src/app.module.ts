import { CatsController } from './common/modules/cats/cats.controller';
import { CatsModule } from './common/modules/cats/cats.module';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { UsersModule } from './common/modules/users/users.module';
import { ProductsModule } from './common/modules/products/products.module';
import { ProductListModule } from './common/modules/product-list/product-list.module';
import { CartModule } from './common/modules/cart/cart.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    CatsModule,
    UsersModule,
    ProductsModule,
    ProductListModule,
    CartModule,
  ],
})
export class AppModule implements NestModule {
  constructor(private connection: Connection) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude({
        path: 'cats',
        method: RequestMethod.POST,
      })
      .forRoutes(CatsController);
  }
}
