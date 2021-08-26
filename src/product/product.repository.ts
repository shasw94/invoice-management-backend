import { EntityRepository, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductFilterDto } from './dto/get-product-dto';
import { Product } from './product.entity';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const { name, rate } = createProductDto;

    const product = this.create({ name, rate });

    await this.save(product);
    return product;
  }

  async getProducts(filterDto: GetProductFilterDto): Promise<Product[]> {
    const { name, search } = filterDto;
    const query = this.createQueryBuilder('product');
    if (name) {
      query.andWhere('product.name = :name', { name });
    }

    if (search) {
      query.andWhere('LOWER(product.name) LIKE LOWER(:search)', {
        search: `%${search}%`,
      });
    }
    const products = await query.getMany();
    return products;
  }
}
