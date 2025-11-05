import { Injectable } from '@nestjs/common';
import  type {CreatePaymentDto}  from '../payments/presentation/dto/create-payment.dto';


@Injectable()
export class PaymentsService {
  create(createPaymentDto: CreatePaymentDto) {
    return 'This action adds a new payment';
  }

  findAll() {
    return `This action returns all payments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }



  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
