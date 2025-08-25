import { Injectable } from '@nestjs/common';
import { createVendorDto } from './dto/vendor.dto';
import { updateVendorDto } from './dto/updatevendor.dto';

@Injectable()
export class VendorService {

    private vendors = [
        { id: 1, name: 'Vendor 1' },
        { id: 2, name: 'Vendor 2' },
        { id: 3, name: 'Vendor 3' },
    ];

    private orders: any[] = [];
//VENDORS METHODS
    getAllVendors() {
        return this.vendors;
    }
    CreateVendor(vendorData: createVendorDto) {
        const newVendor = {
            id: this.vendors.length + 1,
            ...vendorData
        };
        this.vendors.push(newVendor);
        return newVendor;
    }
    UpdateVendor(VendorDate: updateVendorDto) {
        
    }

//ORDERS METHODS

        getAllOrders() {
        return this.orders;
    }
    CreateOrder(orderData: any) {
        if (!orderData.vendorId) {
            return('vendorId is required');
        }
        if (!this.vendors.find(v => v.id === orderData.vendorId)) {
            return(`Vendor with ID ${orderData.vendorId} not found`);
        }
        else{
            this.orders.push(orderData);
            return `Order created for vendor with ID ${orderData.vendorId}
            Data: ${JSON.stringify(orderData)}`;
        }
        
    }

    GetOrder(orderId: number) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) {
            return `Order with ID ${orderId} not found`;
        }
        return order;
    }

    UpdateOrder(vendorId: number, orderId: number, orderData: any) {
        // Logic to update an order for the vendor
        return `Order with ID ${orderId} updated for vendor with ID ${vendorId}`;
    }
    DeleteOrder(vendorId: number, orderId: number) {
        // Logic to delete an order for the vendor
        return `Order with ID ${orderId} deleted for vendor with ID ${vendorId}`;
    }
    UpdatePartialOrder(vendorId: number, orderId: number, orderData: any) {
        // Logic to partially update an order for the vendor
        return `Order with ID ${orderId} partially updated for vendor with ID ${vendorId}`;
    }
}