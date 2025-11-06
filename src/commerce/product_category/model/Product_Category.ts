export default class ProductCategory {
    constructor(
        private readonly product_id: number | string,
        private readonly category_id: number,
    ) {}

    public getProductId(): number | string { return this.product_id; }
    public getCategoryId(): number { return this.category_id; }
}