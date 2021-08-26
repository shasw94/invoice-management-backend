import { Module } from '@nestjs/common';
import { BrandModule } from './brand/brand.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { StoreModule } from './store/store.module';

@Module({
  imports: [
    BrandModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'invoicedb',
      autoLoadEntities: true,
      synchronize: true,
    }),
    OrderModule,
    ProductModule,
    StoreModule,
  ],
  providers: [],
})
export class AppModule {}
