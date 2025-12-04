"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const order_interface_1 = require("./interfaces/order.interface");
const order_schema_1 = require("./schemas/order.schema");
const orders_json_1 = __importDefault(require("./data/orders.json"));
let OrdersService = class OrdersService {
    constructor(configService, orderModel) {
        this.configService = configService;
        this.orderModel = orderModel;
        this.orders = orders_json_1.default;
        this.useOrdersFile = this.configService.get('mongodb.useOrdersFile', true);
        console.log(`[OrdersService] Usando archivo JSON: ${this.useOrdersFile}`);
    }
    async getOrderById(orderId) {
        if (this.useOrdersFile) {
            const order = this.orders.find(o => o.orderId === orderId);
            if (!order) {
                throw new common_1.NotFoundException(`Orden con ID ${orderId} no encontrada`);
            }
            return this.getOrderWithRandomStatus(order);
        }
        else {
            const order = await this.orderModel.findOne({ orderId }).lean().exec();
            if (!order) {
                throw new common_1.NotFoundException(`Orden con ID ${orderId} no encontrada`);
            }
            const orderInterface = this.mongoToInterface(order);
            return this.getOrderWithRandomStatus(orderInterface);
        }
    }
    getOrderWithRandomStatus(order) {
        const statuses = Object.values(order_interface_1.OrderStatus);
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        return {
            ...order,
            status: randomStatus
        };
    }
    mongoToInterface(mongoOrder) {
        return {
            orderId: mongoOrder.orderId,
            status: mongoOrder.status,
            customerName: mongoOrder.customerName,
            customerEmail: mongoOrder.customerEmail,
            orderDate: mongoOrder.orderDate,
            totalAmount: mongoOrder.totalAmount,
            items: mongoOrder.items,
            shippingAddress: mongoOrder.shippingAddress,
        };
    }
    async getAllOrders() {
        if (this.useOrdersFile) {
            return this.orders.map(order => this.getOrderWithRandomStatus(order));
        }
        else {
            const orders = await this.orderModel.find().lean().exec();
            return orders.map(order => {
                const orderInterface = this.mongoToInterface(order);
                return this.getOrderWithRandomStatus(orderInterface);
            });
        }
    }
    async createOrder(orderData) {
        if (this.useOrdersFile) {
            throw new Error('No se pueden crear órdenes cuando se usa el archivo JSON');
        }
        const newOrder = new this.orderModel(orderData);
        const savedOrder = await newOrder.save();
        return this.mongoToInterface(savedOrder.toObject());
    }
    async seedOrders() {
        if (this.useOrdersFile) {
            console.log('[OrdersService] No se puede hacer seed con USE_ORDERS_FILE=true');
            return;
        }
        const count = await this.orderModel.countDocuments();
        if (count > 0) {
            console.log(`[OrdersService] Ya existen ${count} órdenes en MongoDB`);
            return;
        }
        console.log('[OrdersService] Insertando datos iniciales en MongoDB...');
        await this.orderModel.insertMany(this.orders);
        console.log(`[OrdersService] ${this.orders.length} órdenes insertadas exitosamente`);
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        mongoose_2.Model])
], OrdersService);
//# sourceMappingURL=orders.service.js.map