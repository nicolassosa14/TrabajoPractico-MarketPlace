export default class CreateAddressCommand {
    private readonly user_id: string;

    private readonly street_address: string;

    private readonly city: string;

    private readonly postal_code: string;

    private readonly details?: string;

    public constructor(user_id: string, street_address: string, city: string, postal_code: string, details?: string) {
        this.user_id = user_id;
        this.street_address = street_address;
        this.city = city;
        this.postal_code = postal_code;
        this.details = details;
    }

    getUser_id(): string {
        return this.user_id;
    }
    getStreet_address(): string {
        return this.street_address;
    }
    getCity(): string {
        return this.city;
    }
    getPostal_code(): string {
        return this.postal_code;
    }
    getDetails(): string | undefined {
        return this.details;
    }
}