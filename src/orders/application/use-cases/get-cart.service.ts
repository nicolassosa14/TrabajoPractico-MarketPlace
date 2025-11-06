import { Injectable, Inject } from '@nestjs/common';
import type { CartRepository } from '../ports/cart.repository';
import { CartItem } from '../../domain/entities/cart-item.entity';

@Injectable()
export class GetCartService {
  constructor(
    @Inject('CartRepository')
    private readonly cartRepository: CartRepository,
  ) {}

  async execute(item: string) {
    if (CartItem) {
      return this.cartRepository.getByUser(item);
    }
    return this.cartRepository.getByUser(item);
  }
}
