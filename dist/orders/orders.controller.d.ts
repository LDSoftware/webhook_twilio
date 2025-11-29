import { OrdersService } from './orders.service';
import { Order } from './interfaces/order.interface';
export declare class OrdersController {
    private readonly ordersService;
    private readonly logger;
    constructor(ordersService: OrdersService);
    getOrder(orderId: string): Order;
    getAllOrders(): Order[];
    receiveWebhook(body: any): any;
}
