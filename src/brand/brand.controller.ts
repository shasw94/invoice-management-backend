import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Brand } from './brand.entity';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { GetBrandFilterDto } from './dto/get-brand.dto';

@Controller('brand')
export class BrandController {
  constructor(private brandService: BrandService) {}

  @Get()
  getBrands(@Query() filterDto: GetBrandFilterDto): Promise<Brand[]> {
    return this.brandService.getBrands(filterDto);
  }

  @Get('/:id')
  getBrandById(@Param('id') id: string): Promise<Brand> {
    return this.brandService.getBrandById(id);
  }

  @Delete('/:id')
  deleteBrand(@Param('id') id: string): Promise<void> {
    return this.brandService.deleteBrand(id);
  }

  @Patch('/:id/status')
  updateBrand(
    @Param('id') id: string,
    @Body() createBrandDto: CreateBrandDto,
  ): Promise<Brand> {
    const { name, description } = createBrandDto;
    return this.brandService.updateBrand(id, name, description);
  }

  @Post()
  createBrand(@Body() createBrandDto: CreateBrandDto): Promise<Brand> {
    return this.brandService.createBrand(createBrandDto);
  }
}
