import { InternalServerErrorException, Logger } from '@nestjs/common';
import { Brand } from 'src/brand/brand.entity';
import { Store } from 'src/store/store.entity';
import { EntityRepository, getConnection, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductFilterDto } from './dto/get-product-dto';
import { Product } from './product.entity';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  private logger = new Logger('ProductRepository');
  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const { name, rate } = createProductDto;

    const product = this.create({ name, rate });

    await this.save(product);
    return product;
  }

  async addBrand(brand: Brand, product: Product) {
    await getConnection()
      .createQueryBuilder()
      .relation(Product, 'brand')
      .of(product)
      .set(brand);
  }
  async addStore(store: Store, product: Product) {
    await getConnection()
      .createQueryBuilder()
      .relation(Product, 'stores')
      .of(product)
      .add(store);
  }



  async createOrFindProduct(
    createProductDto: CreateProductDto,
  ): Promise<Product> {
    let product = await this.findOne({ name: createProductDto.name });
    if (!product) {
      let newProduct = new Product();
      newProduct.name = createProductDto.name;
      newProduct.rate = createProductDto.rate;
      try {
        await this.save(newProduct);
        product = newProduct;
        return product;
      } catch (error) {
        this.logger.log(`Duplicate Product`);
        product = await this.findOne({ name: createProductDto.name });
        return product;
      }
    }
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
