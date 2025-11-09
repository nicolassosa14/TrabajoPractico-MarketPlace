import { IsEnum } from 'class-validator';
import { OrderStatus } from '../../domain/value-objects/order-status.vo';

export class UpdateStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
