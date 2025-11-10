export class ProductResponseDTO {
    name: string;
    description: string;
    Image_url: string;
    price: number;
    is_available: boolean;
    vendor_id: string;
    category_ids: string;
    vendor_name: string | null;
}
