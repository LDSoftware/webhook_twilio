export declare enum OrderStatus {
    PENDING = "PENDIENTE",
    CONFIRMED = "CONFIRMADA",
    IN_TRANSIT = "EN_TRANSITO",
    DELIVERED = "ENTREGADA",
    CANCELLED = "CANCELADA"
}
export interface OrderItem {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}
export interface Order {
    orderId: string;
    status: OrderStatus;
    customerName: string;
    customerEmail: string;
    orderDate: string;
    totalAmount: number;
    items: OrderItem[];
    shippingAddress: string;
}
