import { Test, TestingModule } from '@nestjs/testing';
import { GetCartService } from '../application/use-cases/get-cart.service';
import { CartRepository } from '../application/ports/cart.repository';
import { CartItem } from '../domain/entities/cart-item.entity';

describe('GetCartService', () => {
    let service: GetCartService;
    let mockCartRepository: jest.Mocked<CartRepository>;

    beforeEach(async () => {
        // Create a mock CartRepository
        mockCartRepository = {
            getByUser: jest.fn(),
            add: jest.fn(),
            clear: jest.fn(),
        } as unknown as jest.Mocked<CartRepository>;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GetCartService,
                { provide: 'CartRepository', useValue: mockCartRepository },
            ],
        }).compile();

        service = module.get<GetCartService>(GetCartService);
    });

    it('deberia de mostrar todos los item del carrito de un usuario', async () => {
        const fakeCartItems: CartItem[] = [
            new CartItem('usuario-1 ', 'producto-1', 2, new Date()),
            new CartItem('usuario-2', 'producto-2', 1, new Date()),
        ];

        mockCartRepository.getByUser.mockResolvedValue(fakeCartItems);

        const result = await service.execute('usuario-1 ');

        expect(result).toEqual(fakeCartItems);
        expect(mockCartRepository.getByUser).toHaveBeenCalledWith('usuario-1 ');
    });
});
