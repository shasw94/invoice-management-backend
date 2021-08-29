import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductFilterDto } from './dto/get-product-dto';
import { Product } from './product.entity';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository,
  ) {}

  createProduct(createProductDto: CreateProductDto): Promise<Product> {
    return this.productRepository.createProduct(createProductDto);
  }

  async getProductById(id: number): Promise<Product> {
    const found = await this.productRepository.findOne(id);
    if (!found) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return found;
  }

  async deleteProduct(id: number): Promise<void> {
    const result = await this.productRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
  }

  async updateProduct(id: number, name: string, rate: number): Promise<Product> {
    const product = await this.getProductById(id);

    product.rate = rate;
    product.name = name;
    await this.productRepository.save(product);

    return product;
  }

  getProducts(filterDto: GetProductFilterDto): Promise<Product[]> {
    return this.productRepository.getProducts(filterDto);
  }
}
