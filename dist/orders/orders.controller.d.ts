import { OrdersService } from './orders.service';
import { TwilioMediaService } from './twilio-media.service';
import { TwilioMessagingService } from './twilio-messaging.service';
import { Order } from './interfaces/order.interface';
export declare class OrdersController {
    private readonly ordersService;
    private readonly twilioMediaService;
    private readonly twilioMessagingService;
    private readonly logger;
    constructor(ordersService: OrdersService, twilioMediaService: TwilioMediaService, twilioMessagingService: TwilioMessagingService);
    getOrder(orderId: string): Order;
    getAllOrders(): Order[];
    receiveWebhook(body: any): Promise<void>;
}
