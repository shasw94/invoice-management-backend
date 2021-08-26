import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreController } from './store.controller';
import { StoreRepository } from './store.repository';
import { StoreService } from './store.service';

@Module({
  imports: [TypeOrmModule.forFeature([StoreRepository])],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
