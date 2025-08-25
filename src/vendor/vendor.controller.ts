import { Controller, Delete, Get, Param, Patch, Post, Put, Body } from '@nestjs/common';
import { VendorService } from './vendor.service';


@Controller({})
export class VendorController {
    vendorService: VendorService;
    constructor(vendorService:VendorService) {
        this.vendorService = vendorService;
    }
    @Get('/vendors')
    getAll() {
        return this.vendorService.getAllVendors();
    }
    @Get('/vendor/orders')
    getAllOrders() {
        return this.vendorService.getAllOrders();
    }
    @Post('/vendor/order')
    createOrder(@Body() order: any) {
        return this.vendorService.CreateOrder(order);
    }
    @Get('/vendor/order/:orderId')
    getOrder(@Param('orderId') OrderId: number): string {
        return this.vendorService.GetOrder(OrderId);
    }
    @Put('/vendor/order/:orderId')
    updateOrder(@Param('id') id: number, @Param('orderId') orderId: number): string {
        return this.vendorService.UpdateOrder(id, orderId, {});
    }

    @Delete('/vendor/order/:orderId')
    deleteOrder(@Param('id') id: number, @Param('orderId') orderId: number): string {
        return this.vendorService.DeleteOrder(id, orderId);
    }
    @Patch('/vendor/order/:orderId')
    patchOrder(@Param('id') id: number, @Param('orderId') orderId: number): string {
        return this.vendorService.UpdatePartialOrder(id, orderId, {});
    }

    @Get('/vendor/menu')
    getVendorMenu(@Param('id') id: number): string {
        return `This action returns the menu for vendor with ID ${id}`;
    }
    @Get('/vendor/config')
    GetVendor(@Param('id') id: number): string {
        
        return `This action returns the configuration for vendor with ID ${id}`;

    }
    @Get('/vendor/products')
    getVendorProducts(@Param('id') id: number): string {
        return `This action returns the products for vendor with ID ${id}`;
    }

}
