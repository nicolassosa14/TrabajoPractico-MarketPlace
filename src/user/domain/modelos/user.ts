export default class User{
    public constructor (
        private readonly email: string,
        private readonly password: string,
        private readonly phone?: number,
        private readonly name?: string,
        private readonly id?: number,
        private readonly uuid?: string,
    )
    {
    }

    public getPassword() : string{
        return this.password
    }

    public getName() : string | undefined
    {
        return this.name;
    }

    public getEmail() : string
    {
        return this.email;
    }
    
    public getPhone() : number | undefined
    {
        return this.phone;
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