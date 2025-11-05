import { Payment } from '../../domain/entities/payment.entity';

export function rowToPayment(row: any): Payment {
    if (!row) return null as any;
    return new Payment(
        row.id,
        row.order_id,
        Number(row.amount),
        Number(row.tip_amount || 0),
        row.payment_method,
        row.status,
        row.transaction_id,
        new Date(row.created_at || Date.now())
    );
    }

export function paymentToRow(payment: Payment) {
    return {
        id: payment.id,
        order_id: payment.orderId,
        amount: payment.amount,
        tip_amount: payment.tipAmount ?? 0,
        payment_method: payment.paymentMethod,
        status: payment.status,
        transaction_id: payment.transactionId ?? null,
        created_at: payment.createdAt ? payment.createdAt.toISOString() : undefined,
    };
    }