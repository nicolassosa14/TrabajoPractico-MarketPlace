import { Inject, Injectable } from '@nestjs/common';
import type { CartRepository } from '../ports/cart.repository';

@Injectable()
export class ClearCartService {
  constructor(
    @Inject('CartRepository')
    private readonly cartRepository: CartRepository,
  ) {}

  async execute(userId: string) {
    if (userId) {
      return this.cartRepository.clearCart(userId);
    }
    return this.cartRepository.clearCart(userId);
  }
}
