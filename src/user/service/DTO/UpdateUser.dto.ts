export default class UpdatePutUserCommand{
    private readonly id: number;
    private readonly name: string
    private readonly email: string;
    private readonly phone_number: string;
    public constructor(id: number, name: string, email: string, phone_number: string){
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone_number = phone_number;
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
    public getPhone(): string{
        return this.phone_number;
    }
}

export class PatchUserCommand{
    private readonly id: string;
    private readonly first_name?: string
    private readonly last_name?: string
    private readonly email?: string;
    private readonly phone_number?: string;
    public constructor(id: string, first_name?: string, last_name?:string, email?: string, phone_number?: string){
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.phone_number = phone_number;
    }
    public getId(): string{
        return this.id;
    }
    public getfirst_name(): string | undefined{
        return this.first_name;
    }
    public getlast_name(): string | undefined{
        return this.last_name;
    }
    public getEmail(): string | undefined{
        return this.email;
    }
    public getPhone(): string | undefined{
        return this.phone_number;
    }
}