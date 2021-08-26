import { EntityRepository, Repository } from 'typeorm';
import { Store } from './Store.entity';
import { CreateStoreDto } from './dto/create-Store.dto';
import { GetStoreFilterDto } from './dto/get-store.dto';

@EntityRepository(Store)
export class StoreRepository extends Repository<Store> {
  async createStore(createStoreDto: CreateStoreDto): Promise<Store> {
    const { name, location } = createStoreDto;

    const Store = this.create({ name, location });

    await this.save(Store);
    return Store;
  }

  async getStores(filterDto: GetStoreFilterDto): Promise<Store[]> {
    const { name, search } = filterDto;

    const query = this.createQueryBuilder('store');

    if (name) {
      query.andWhere('store.name =:name', { name });
    }

    if (search) {
      query.andWhere(
        'LOWER(store.name) LIKE LOWER(:search) OR LOWER(store.location) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    const Stores = await query.getMany();
    return Stores;
  }
}
