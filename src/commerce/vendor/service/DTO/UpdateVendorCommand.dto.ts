export default class UpdatePatchVendorCommand{
    private readonly id: number;
    private readonly name?: string
    private readonly email?: string;
    private readonly password?: string;
    private readonly descripcion?: string;
    private readonly address?: string;
    private readonly is_active?: boolean;

    public constructor(id: number, name?: string, email?: string, password?: string, descripcion?: string, address?: string, is_active?: boolean){
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.descripcion = descripcion;
        this.address = address;
        this.is_active = is_active;
    }
    public getId(): number{
        return this.id;
    }
    public getName(): string | undefined{
        return this.name;
    }
    public getEmail(): string | undefined{
        return this.email;
    }
    public getPassword(): string | undefined{
        return this.password;
    }
    public getDescripcion(): string | undefined{
        return this.descripcion;
    }
    public getAddress(): string | undefined{
        return this.address;
    }
    public getIsActive(): boolean | undefined{
        return this.is_active;
    }

}

export class UpdatePutVendorCommand{
    private readonly id: number;
    private readonly name: string
    private readonly email: string;
    private readonly password: string;
    private readonly descripcion: string;
    private readonly address: string;
    private readonly is_active: boolean;

    public constructor(id: number, name: string, email: string, password: string, descripcion: string, address: string, is_active: boolean){
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.descripcion = descripcion;
        this.address = address;
        this.is_active = is_active;
    }
    public getId(): number{
        return this.id;
    }
    public getName(): string{
        return this.name;
    }
    public getEmail(): string{
        return this.email;
    }
    public getPassword(): string{
        return this.password;
    }
    public getDescripcion(): string{
        return this.descripcion;
    }
    public getAddress(): string{
        return this.address;
    }
    public getIsActive(): boolean{
        return this.is_active;
    }
}