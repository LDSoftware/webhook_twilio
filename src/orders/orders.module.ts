import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersController } from './orders.controller';
import { DebugController } from './debug.controller';
import { OrdersService } from './orders.service';
import { TwilioMediaService } from './twilio-media.service';
import { TwilioMessagingService } from './twilio-messaging.service';
import { Order, OrderSchema } from './schemas/order.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
  ],
  controllers: [OrdersController, DebugController],
  providers: [OrdersService, TwilioMediaService, TwilioMessagingService],
})
export class OrdersModule {}
