import { IsUUID, IsNumber, Min, IsIn, IsOptional, IsString } from 'class-validator';

    export class CreatePaymentDto {
    @IsUUID()
    orderId: string;

    @IsNumber()
    @Min(0.01)
    amount: number;

    @IsOptional()
    @IsNumber()
    tipAmount?: number;

    @IsString()
    @IsIn(['credit_card', 'paypal', 'cash', 'mercado_pago'])
    paymentMethod: 'credit_card' | 'paypal' | 'cash' | 'mercado_pago';

    @IsOptional()
    @IsString()
    promotionCode?: string;
    }