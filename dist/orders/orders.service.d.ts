import { Order } from './interfaces/order.interface';
export declare class OrdersService {
    private orders;
    getOrderById(orderId: string): Order;
    private getOrderWithRandomStatus;
    getAllOrders(): Order[];
}
