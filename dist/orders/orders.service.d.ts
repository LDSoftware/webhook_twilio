import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { Order as OrderInterface } from './interfaces/order.interface';
import { OrderDocument } from './schemas/order.schema';
export declare class OrdersService {
    private readonly configService;
    private orderModel;
    private orders;
    private useOrdersFile;
    constructor(configService: ConfigService, orderModel: Model<OrderDocument>);
    getOrderById(orderId: string): Promise<OrderInterface>;
    private getOrderWithRandomStatus;
    private mongoToInterface;
    getAllOrders(): Promise<OrderInterface[]>;
    createOrder(orderData: Partial<OrderInterface>): Promise<OrderInterface>;
    seedOrders(): Promise<void>;
}
