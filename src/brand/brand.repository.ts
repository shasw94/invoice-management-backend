import { EntityRepository, Repository } from 'typeorm';
import { Brand } from './brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { GetBrandFilterDto } from './dto/get-brand.dto';

@EntityRepository(Brand)
export class BrandRepository extends Repository<Brand> {
  async createBrand(createBrandDto: CreateBrandDto): Promise<Brand> {
    const { name, description } = createBrandDto;

    const brand = this.create({ name, description });

    await this.save(brand);
    return brand;
  }

  async getBrands(filterDto: GetBrandFilterDto): Promise<Brand[]> {
    const { name, search } = filterDto;

    const query = this.createQueryBuilder('brand');

    if (name) {
      query.andWhere('brand.name =:name', { name });
    }

    if (search) {
      query.andWhere(
        'LOWER(brand.name) LIKE LOWER(:search) OR LOWER(brand.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    const brands = await query.getMany();
    return brands;
  }
}
