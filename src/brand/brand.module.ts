import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandController } from './brand.controller';
import { BrandRepository } from './brand.repository';
import { BrandService } from './brand.service';

@Module({
  imports: [TypeOrmModule.forFeature([BrandRepository])],
  controllers: [BrandController],
  providers: [BrandService],
})
export class BrandModule {}
