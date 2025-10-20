export default class Vendor {
    public constructor (
        private readonly email: string,
        private readonly password: string,
        private readonly descripcion: string,
        private readonly adress: string,
        private readonly is_active: boolean = true,
        private readonly name?: string,
        private readonly id?: number,
        private readonly uuid?: string,

    )
    {
    }

    public getEmail() : string
    {
        return this.email;
    }
    
     public getPassword() : string{
        return this.password
    }

    public getDescripcion() : string {
        return this.descripcion;
    }

    public getAdress() : string {
        return this.adress;
    }

 
    public getisActive() : boolean {
        return this.is_active;
    }

    public getName() : string | undefined
    {
        return this.name;
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