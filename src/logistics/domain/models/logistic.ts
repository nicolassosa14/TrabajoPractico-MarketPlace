export default class Logistic {

    private readonly user_id: string;
    private readonly vehicle_type: string;
    private readonly license_plate: string;
    private readonly is_available: boolean;
    private readonly id?: string;

    public constructor(
        user_id: string,
        vehicle_type: string,
        license_plate: string,
        is_available: boolean,
        id?: string,
    ) {
        this.user_id = user_id;
        this.vehicle_type = vehicle_type;
        this.license_plate = license_plate;
        this.is_available = is_available;
        this.id = id;
    }

    getUser_id(): string {
        return this.user_id;
    }
    getVehicle_type(): string {
        return this.vehicle_type;
    }
    getLicense_plate(): string {
        return this.license_plate;
    }
    getIs_available(): boolean {
        return this.is_available;
    }
    getId(): string | undefined {
        return this.id;
    }
    
}


