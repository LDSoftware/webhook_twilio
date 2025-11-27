export declare class OrderDto {
    orderId: string;
    status: string;
    customerName: string;
    customerEmail: string;
    orderDate: string;
    totalAmount: number;
    items: {
        productId: string;
        productName: string;
        quantity: number;
        unitPrice: number;
        subtotal: number;
    }[];
    shippingAddress: string;
}
