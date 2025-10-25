export default class Address{
    public constructor (
        private readonly user_id: string,
        private readonly postal_code?: string,
        private readonly street_address?: string,
        private readonly city?: string,
        private readonly id? : string,
        private readonly details?: string
    )
    {
    }

    public getUser_id() : string{
        return this.user_id
    }
    public getId() : string | undefined{
        return this.id;
    }
    public getStreet_address() : string | undefined{
        return this.street_address
    }
    public getCity() : string | undefined{
        return this.city
    }
    public getPostal_code() : string | undefined{
        return this.postal_code
    }
    
    public getDetails() : string | undefined
    {
        return this.details;
    }
    
}