import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateOrderService } from '../application/use-cases/create-order.service';
import { GetOrdersService } from '../application/use-cases/get-orders.service';
import { UpdateStatusService } from '../application/use-cases/update-status.service';
import { AddCartItemService } from '../application/use-cases/add-cart-item.service';
import { GetCartService } from '../application/use-cases/get-cart.service';
import { ClearCartService } from '../application/use-cases/clear-cart.service';
import { AddOrderItemService } from 'src/orders/application/use-cases/add-order-item.service';
import { GetOrderItemsService } from '../application/use-cases/get-order-items.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { AddCartItemDto } from './dtos/add-cart-item.dto';
import { AddOrderItemDto } from './dtos/add-order-item.dto';
import { UpdateStatusDto } from './dtos/update-status.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly createOrder: CreateOrderService,
    private readonly getOrders: GetOrdersService,
    private readonly updateStatus: UpdateStatusService,
    private readonly addCartItem: AddCartItemService,
    private readonly getCart: GetCartService,
    private readonly clearCart: ClearCartService,
    private readonly addOrderItem: AddOrderItemService,
    private readonly getOrderItems: GetOrderItemsService,
  ) {}

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.createOrder.execute(dto as any);
  }

  @Get()
  findAll() {
    return this.getOrders.execute();
  }

  @Patch(':id/status')
  update(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.updateStatus.execute(id, dto.status);
  }

  // ----- CART -----
  @Post('cart')
  addToCart(@Body() dto: AddCartItemDto) {
    return this.addCartItem.execute({ ...dto, addedAt: new Date() } as any);
  }

  @Get('cart/:userId')
  getCartItems(@Param('userId') userId: string) {
    return this.getCart.execute(userId);
  }

  @Patch('cart/clear/:userId')
  clearCartItems(@Param('userId') userId: string) {
    return this.clearCart.execute(userId);
  }

  // ----- ORDER ITEMS -----
  @Post('items')
  addItem(@Body() dto: AddOrderItemDto) {
    return this.addOrderItem.execute(dto as any);
  }

  @Get('items/:orderId')
  getItems(@Param('orderId') orderId: string) {
    return this.getOrderItems.execute(orderId);
  }
}
