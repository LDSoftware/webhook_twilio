"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersModule = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const mongoose_1 = require("@nestjs/mongoose");
const orders_controller_1 = require("./orders.controller");
const debug_controller_1 = require("./debug.controller");
const orders_service_1 = require("./orders.service");
const twilio_media_service_1 = require("./twilio-media.service");
const twilio_messaging_service_1 = require("./twilio-messaging.service");
const order_schema_1 = require("./schemas/order.schema");
let OrdersModule = class OrdersModule {
};
exports.OrdersModule = OrdersModule;
exports.OrdersModule = OrdersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule,
            mongoose_1.MongooseModule.forFeature([{ name: order_schema_1.Order.name, schema: order_schema_1.OrderSchema }]),
        ],
        controllers: [orders_controller_1.OrdersController, debug_controller_1.DebugController],
        providers: [orders_service_1.OrdersService, twilio_media_service_1.TwilioMediaService, twilio_messaging_service_1.TwilioMessagingService],
    })
], OrdersModule);
//# sourceMappingURL=orders.module.js.map