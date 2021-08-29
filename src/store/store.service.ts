import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStoreDto } from './dto/create-store.dto';
import { GetStoreFilterDto } from './dto/get-store.dto';
import { Store } from './store.entity';
import { StoreRepository } from './store.repository';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(StoreRepository)
    private storeRepository: StoreRepository,
  ) {}

  createStore(createStoreDto: CreateStoreDto): Promise<Store> {
    return this.storeRepository.createStore(createStoreDto);
  }

  async getStoreById(id: number): Promise<Store> {
    const found = await this.storeRepository.findOne(id);
    if (!found) {
      throw new NotFoundException(`Store with ID "${id}" not found`);
    }
    return found;
  }

  async deleteStore(id: number): Promise<void> {
    const result = await this.storeRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  async updateStore(
    id: number,
    name: string,
    location: string,
  ): Promise<Store> {
    const store = await this.getStoreById(id);

    store.location = location;
    await this.storeRepository.save(store);

    return store;
  }

  getStores(filterDto: GetStoreFilterDto): Promise<Store[]> {
    return this.storeRepository.getStores(filterDto);
  }
}
