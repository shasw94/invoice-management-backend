import { EntityRepository, Repository } from "typeorm";
import { CreateOrderToProductDto } from "./dto/create-order.dto";
import { OrderToProduct } from "./order.product.entity";

@EntityRepository(OrderToProduct)
export class OrderToProductRepository extends Repository<OrderToProduct> {
    async createOrderToProduct(createOrderToProductDto: CreateOrderToProductDto) : Promise<OrderToProduct> {
        const { orderId, productId, quantity, totalAmountPaid, location} = createOrderToProductDto;
        const orderProduct = this.create({ orderId, productId, quantity, totalAmountPaid, location });
        await this.save(orderProduct);
        return orderProduct;
    }
}