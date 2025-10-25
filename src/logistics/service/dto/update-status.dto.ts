export class UpdateStatusLogisticCommand {
    private readonly id: string;
    private readonly user_id: string;
    private readonly is_available: boolean;

    constructor(id:string, user_id: string, is_available: boolean) {
        this.user_id = user_id;
        this.id = id;
        this.is_available = is_available;
    }
    
    getUser_id(): string {
        return this.user_id;
    }
    getId(): string {
        return this.id;
    }
    getIs_available(): boolean {
        return this.is_available;
    }

}
