export default class UpdateAddressCommand {
    id: string;

    street_address?: string;

    city?: string;

    postal_code?: string;

    details?: string;

    public constructor(id: string, street_address?: string, city?: string, postal_code?: string, details?: string) {
        this.id = id;
        this.street_address = street_address;
        this.city = city;
        this.postal_code = postal_code;
        this.details = details;
    }
}
