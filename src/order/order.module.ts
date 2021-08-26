import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunicationGateway } from './communication.gateway';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';
import { OrderService } from './order.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderRepository])],
  controllers: [OrderController],
  providers: [OrderService, CommunicationGateway]
})
export class OrderModule {}
