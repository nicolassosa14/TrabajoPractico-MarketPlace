export class CreatePaymentResponseDto {
  paymentId: string;
  status: string;
  checkoutUrl?: string;
  message?: string;
}
