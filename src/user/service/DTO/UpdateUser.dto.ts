export default class UpdatePutUserCommand{
    private readonly id: number;
    private readonly name: string
    private readonly email: string;
    private readonly phone: number;
    public constructor(id: number, name: string, email: string, phone: number){
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
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
    public getPhone(): number{
        return this.phone;
    }
}

export class UpdatePatchUserCommand{
    private readonly id: number;
    private readonly name?: string
    private readonly email?: string;
    private readonly phone?: number;
    public constructor(id: number, name?: string, email?: string, phone?: number){
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
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
    public getPhone(): number | undefined{
        return this.phone;
    }
}