    export type MPPreferenceItem = {
    title: string;
    quantity: number;
    unit_price: number;
    };

    export type MPPreferenceResponse = {
    id: string;
    init_point?: string;
    sandbox_init_point?: string;
    [key: string]: any;
    };

import { Injectable } from '@nestjs/common';
import * as mercadopago from 'mercadopago';

@Injectable()
export class MercadoPagoAdapter {
    private client: mercadopago.MercadoPagoConfig;
    
    constructor() {
        // Configura el token de acceso
        this.client = new mercadopago.MercadoPagoConfig({
            accessToken: "APP_USR-1076557273155235-102419-0eb55ffd36d30b97a7fb5590b2d199ce-2946106382"
        });
    }

    async createPreference(paymentData: {
        items: Array<{
            id: string;
            title: string;
            unit_price: number;
            quantity: number;
        }>;
        external_reference: string;
    }) {
        try {
            const preference = new mercadopago.Preference(this.client);
            const response = await preference.create({ body: paymentData });
            return response;
        } catch (error) {
            throw new Error(`Error creating MercadoPago preference: ${error.message}`);
        }
    }

    async getPaymentStatus(paymentId: string) {
        try {
            const payment = new mercadopago.Payment(this.client);
            const response = await payment.get({ id: paymentId });
            return response;
        } catch (error) {
            throw new Error(`Error getting payment status: ${error.message}`);
        }
    }
}