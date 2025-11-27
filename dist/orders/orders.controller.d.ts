import { OrdersService } from './orders.service';
import { Order } from './interfaces/order.interface';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    getOrder(orderId: string): Order;
    getAllOrders(): Order[];
}
