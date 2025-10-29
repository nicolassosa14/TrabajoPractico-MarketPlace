import { IsEnum, IsNumber, IsString } from 'class-validator';
import { OrderStatus } from 'src/orders/domain/value-objects/order-status.vo';

export class CreateOrderDto {
    @IsString()
    userId: string;

    @IsString()
    vendorId: string;

    @IsString()
    addressId: string;

    @IsNumber()
    subtotal: number;

    @IsNumber()
    deliveryFee: number;

    @IsNumber()
    discountApplied: number;

    @IsNumber()
    taxes: number;

    @IsNumber()
    totalAmount: number;

    @IsEnum(OrderStatus) status: OrderStatus;
}