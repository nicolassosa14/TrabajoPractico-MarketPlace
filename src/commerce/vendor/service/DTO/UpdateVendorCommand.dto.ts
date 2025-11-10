export default class UpdatePatchVendorCommand {
    private readonly id: number;
    private readonly name?: string
    private readonly email?: string;
    private readonly password?: string;
    private readonly description?: string;
    private readonly address?: string;
    private readonly is_active?: boolean;
    private readonly image_url?: string;

    public constructor(id: number, name?: string, email?: string, password?: string, description?: string, address?: string, is_active?: boolean, image_url?: string) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.description = description;
        this.address = address;
        this.is_active = is_active;
        this.image_url = image_url;
    }
    public getId(): number {
        return this.id;
    }
    public getName(): string | undefined {
        return this.name;
    }
    public getEmail(): string | undefined {
        return this.email;
    }
    public getPassword(): string | undefined {
        return this.password;
    }
    public getDescription(): string | undefined {
        return this.description;
    }
    public getAddress(): string | undefined {
        return this.address;
    }
    public getIsActive(): boolean | undefined {
        return this.is_active;
    }

    public getImageUrl(): string | undefined {
        return this.image_url;
    }

}

export class UpdatePutVendorCommand {
    private readonly id: number;
    private readonly name: string
    private readonly email: string;
    private readonly password: string;
    private readonly description: string;
    private readonly address: string;
    private readonly is_active: boolean;
    private readonly image_url: string;


    public constructor(id: number, name: string, email: string, password: string, description: string, address: string, is_active: boolean, image_url: string) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.description = description;
        this.address = address;
        this.is_active = is_active;
        this.image_url = image_url;
    }
    public getId(): number {
        return this.id;
    }
    public getName(): string {
        return this.name;
    }
    public getEmail(): string {
        return this.email;
    }
    public getPassword(): string {
        return this.password;
    }
    public getDescription(): string {
        return this.description;
    }
    public getAddress(): string {
        return this.address;
    }
    public getIsActive(): boolean {
        return this.is_active;
    }
    public getImageUrl(): string {
        return this.image_url;
    }

}