import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { TwilioMediaService } from './twilio-media.service';
import { TwilioMessagingService } from './twilio-messaging.service';

@Module({
  imports: [HttpModule],
  controllers: [OrdersController],
  providers: [OrdersService, TwilioMediaService, TwilioMessagingService],
})
export class OrdersModule {}
