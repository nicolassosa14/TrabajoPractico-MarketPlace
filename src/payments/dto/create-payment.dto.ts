import { IsUUID, IsNumber, Min, IsString, IsIn, IsOptional } from 'class-validator';

export class CreatePaymentDto {
  @IsUUID()
  orderId: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsString()
  @IsIn(['cash', 'mercado_pago'])
  method: 'cash' | 'mercado_pago';

  @IsOptional()
  metadata?: Record<string, any>;
}