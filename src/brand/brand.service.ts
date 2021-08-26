import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from './brand.entity';
import { BrandRepository } from './brand.repository';
import { CreateBrandDto } from './dto/create-brand.dto';
import { GetBrandFilterDto } from './dto/get-brand.dto';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(BrandRepository)
    private brandRepository: BrandRepository,
  ) {}

  // getAllBrands() {
  //   return this.brands;
  // }

  createBrand(createBrandDto: CreateBrandDto): Promise<Brand> {
    return this.brandRepository.createBrand(createBrandDto);
  }

  async getBrandById(id: string): Promise<Brand> {
    const found = await this.brandRepository.findOne(id);
    if (!found) {
      throw new NotFoundException(`Brand with ID "${id}" not found`);
    }
    return found;
  }

  async deleteBrand(id: string): Promise<void> {
    const result = await this.brandRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  async updateBrand(id: string, name: string, description: string): Promise<Brand> {
    const brand = await this.getBrandById(id);

    brand.description = description;
    brand.name = name;
    await this.brandRepository.save(brand);

    return brand;
  }

  getBrands(filterDto: GetBrandFilterDto) : Promise<Brand[]>{
    return this.brandRepository.getBrands(filterDto);
  }

}
