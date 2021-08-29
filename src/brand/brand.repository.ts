import { InternalServerErrorException, Logger } from '@nestjs/common';
import { Product } from 'src/product/product.entity';
import { EntityRepository, getConnection, Repository } from 'typeorm';
import { Brand } from './brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { GetBrandFilterDto } from './dto/get-brand.dto';

@EntityRepository(Brand)
export class BrandRepository extends Repository<Brand> {
  private logger = new Logger('BrandRepository');
  async createBrand(createBrandDto: CreateBrandDto): Promise<Brand> {
    const { name, description } = createBrandDto;

    const brand = this.create({ name, description });

    await this.save(brand);
    return brand;
  }

  async createOrFindBrand(createBrandDto: CreateBrandDto): Promise<Brand> {
    let brand = await this.findOne({ name: createBrandDto.name });
    if (!brand) {
      let newBrand = new Brand();
      newBrand.name = createBrandDto.name;
      try {
        await this.save(newBrand);
        brand = newBrand;
        return brand;
      } catch (error) {
        this.logger.log(`Duplicate product`);
        brand = await this.findOne({ name: createBrandDto.name });
        return brand;
      }
    }
  }

  async addProduct(product: Product, brand: Brand): Promise<void> {
    await getConnection()
      .createQueryBuilder()
      .relation(Brand, 'products')
      .of(brand)
      .add(product);
  }

  async getBrands(filterDto: GetBrandFilterDto): Promise<Brand[]> {
    const { name, search } = filterDto;

    const query = this.createQueryBuilder('brand');

    if (name) {
      query.andWhere('brand.name =:name', { name });
    }

    if (search) {
      query.andWhere(
        '(LOWER(brand.name) LIKE LOWER(:search) OR LOWER(brand.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    const brands = await query.getMany();
    return brands;
  }
}
