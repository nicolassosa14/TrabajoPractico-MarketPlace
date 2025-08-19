import { Controller, Get, Param } from '@nestjs/common';

@Controller({})
export class VendorController {

    @Get('/getAll')
    getAll(): string {
        return 'This action returns all vendors';
    }
    @Get('/vendor/:id/menu')
    getVendorMenu(@Param('id') id: number): string {
        return `This action returns the menu for vendor with ID ${id}`;
    }
    @Get('/vendor/:id/config')
    GetVendor(@Param('id') id: number): string {
        return `This action returns the configuration for vendor with ID ${id}`;
    }
    @Get('/vendor/:id/products')
    getVendorProducts(@Param('id') id: number): string {
        return `This action returns the products for vendor with ID ${id}`;
    }
}
