export default class Address{
    public constructor (

        private readonly user_id: string,
        private readonly street_address: string,
        private readonly city: string,
        private readonly postal_code: string,
        private readonly details?: string
    )
    {
    }

    public getUser_id() : string{
        return this.user_id
    }
    public getStreet_address() : string{
        return this.street_address
    }
    public getCity() : string{
        return this.city
    }
    public getPostal_code() : string{
        return this.postal_code
    }
    
    public getDetails() : string | undefined
    {
        return this.details;
    }
    
}