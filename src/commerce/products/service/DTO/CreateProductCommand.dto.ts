export default class CreateProductCommandDTO {
    public readonly name: string;
    public readonly description: string;
    public readonly price: number;
    public readonly image_url: string;
    public readonly is_available: boolean = true;
    public readonly vendor_id : number;
    public readonly category_ids: number[];

    getName(): string {
        return this.name;
    }
    getDescription(): string {
        return this.description;
    }
    getPrice(): number {
        return this.price;
    }
    getImageUrl(): string {
        return this.image_url;
    }
    getIsAvailable(): boolean {
        return this.is_available;
    }
    getVendorId(): number {
        return this.vendor_id;
    }
    getCategoryIds() : number[]  {
        return this.category_ids;
    }

    public constructor(
        name: string,
        description: string,
        price: number,
        image_url: string,
        is_available: boolean,
        vendor_id : number,
        category_ids?: number[],
    ) {
            this.name = name,
            this.description = description,
            this.price = price,
            this.image_url = image_url,
            this.is_available = is_available
            this.vendor_id = vendor_id
            this.category_ids = category_ids || [];
    
    }
}