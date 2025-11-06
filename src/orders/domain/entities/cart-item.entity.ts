export class CartItem{
    constructor(
        public userId: string,
        public productId: string,
        public quantity: number,
        public addedAt: number,
    ) {}
}