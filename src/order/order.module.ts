import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandRepository } from 'src/brand/brand.repository';
import { ProductRepository } from 'src/product/product.repository';
import { StoreRepository } from 'src/store/store.repository';
import { CommunicationGateway } from './communication.gateway';
import { OrderController } from './order.controller';
import { OrderToProductRepository } from './order.product.repository';
import { OrderRepository } from './order.repository';
import { OrderService } from './order.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderRepository,
      OrderToProductRepository,
      StoreRepository,
      ProductRepository,
      BrandRepository,
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService, CommunicationGateway],
})
export class OrderModule {}
