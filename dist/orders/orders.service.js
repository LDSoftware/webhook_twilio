"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const order_interface_1 = require("./interfaces/order.interface");
const orders_json_1 = __importDefault(require("./data/orders.json"));
let OrdersService = class OrdersService {
    constructor() {
        this.orders = orders_json_1.default;
    }
    getOrderById(orderId) {
        const order = this.orders.find(o => o.orderId === orderId);
        if (!order) {
            throw new common_1.NotFoundException(`Orden con ID ${orderId} no encontrada`);
        }
        const randomOrder = this.getOrderWithRandomStatus(order);
        return randomOrder;
    }
    getOrderWithRandomStatus(order) {
        const statuses = Object.values(order_interface_1.OrderStatus);
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        return {
            ...order,
            status: randomStatus
        };
    }
    getAllOrders() {
        return this.orders.map(order => this.getOrderWithRandomStatus(order));
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)()
], OrdersService);
//# sourceMappingURL=orders.service.js.map