import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module'; // Import SupabaseModule
import { OrdersController } from './interfaces/orders.controller';
import { CreateOrderService } from './application/use-cases/create-order.service';
import { UpdateStatusService } from './application/use-cases/update-status.service';
import { GetOrdersService } from './application/use-cases/get-orders.service';
import { AddCartItemService } from './application/use-cases/add-cart-item.service';
import { GetCartService } from './application/use-cases/get-cart.service';
import { ClearCartService } from './application/use-cases/clear-cart.service';
import { AddOrderItemService } from './application/use-cases/add-order-item.service';
import { GetOrderItemsService } from './application/use-cases/get-order-items.service';
import { SupabaseOrderRepository } from './insfrastructure/repositories/supabase-order.repository';
import { SupabaseCartRepository } from './insfrastructure/repositories/supabase-cart.repository';
import { SupabaseOrderItemRepository } from './insfrastructure/repositories/supabase-order-item.repository';
import { PaymentAdapter } from './insfrastructure/adapters/payment.adapter';
import { NotificationAdapter } from './insfrastructure/adapters/notification.adapter';
//import { OrderRepository } from './application/ports/order.repository';
//import { CartRepository } from './application/ports/cart.repository';
//import { OrderItemRepository } from './application/ports/order-item.repository';
//import { PaymentService } from './application/ports/payment.service';
//import { NotificationService } from './application/ports/notification.service';

@Module({
  imports: [SupabaseModule], // Add SupabaseModule to imports
  controllers: [OrdersController],
  providers: [
    //uso de casos
    CreateOrderService,
    UpdateStatusService,
    GetOrdersService,
    AddCartItemService,
    GetCartService,
    ClearCartService,
    AddOrderItemService,
    GetOrderItemsService,

    //repositorios
    { provide: 'OrderRepository', useClass: SupabaseOrderRepository },
    { provide: 'CartRepository', useClass: SupabaseCartRepository },
    { provide: 'OrderItemRepository', useClass: SupabaseOrderItemRepository },

    //adaptadores
    { provide: 'PaymentService', useClass: PaymentAdapter },
    { provide: 'NotificationService', useClass: NotificationAdapter },
  ],
  exports: [GetCartService, CreateOrderService],
})
export class OrdersModule {}
