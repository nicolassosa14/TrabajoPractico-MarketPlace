import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateOrderService } from '../application/use-cases/create-order.service';
import { UpdateStatusService } from '../application/use-cases/update-status.service';
import { GetOrdersService } from '../application/use-cases/get-orders.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateStatusDto } from './dtos/update-status.dto';

@Controller('orders')
export class OrdersController {
    constructor(
        private readonly createOrderService: CreateOrderService,
        private readonly updateStatusService: UpdateStatusService,
        private readonly getOrdersService: GetOrdersService,
    ) {}

    @Post()
    async create(@Body() dto: CreateOrderDto) {
        return this.createOrderService.execute(dto);
    }

    @Patch(':id/status')
    async updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
        return this.updateStatusService.execute(id, dto.status);
    }

    @Get()
    async findAll() {
        return this.getOrdersService.execute();
    }

    @Get()
    async TestMessage(){
        return 'Primer test con postman'
    }
}