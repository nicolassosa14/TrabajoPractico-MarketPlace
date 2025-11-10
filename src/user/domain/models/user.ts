export default class User{
    public constructor (
        private readonly email: string,
        private readonly password: string,
        private readonly first_name?: string,
        private readonly last_name?: string,
        private readonly phone_number?: string,
        private readonly id?: number,
        private readonly uuid?: string,
    )
    {
    }

    public getPassword() : string{
        return this.password
    }

    public getFirst_Name() : string | undefined
    {
        return this.first_name;
    }
    public getLast_Name() : string | undefined
    {
        return this.last_name;
    }

    public getEmail() : string
    {
        return this.email;
    }
    
    public getPhone() : string | undefined
    {
        return this.phone_number;
    }
    public getId() : number | undefined
    {
        return this.id;
    }
    public getUuid() : string | undefined
    {
        return this.uuid;
    }
}