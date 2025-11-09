export class CreateLogisticCommand {
  private readonly user_id: string;
  private readonly vehicle_type: string;
  private readonly license_plate: string;
  private readonly is_available: boolean;

  constructor(
    user_id: string,
    vehicle_type: string,
    license_plate: string,
    is_available: boolean,
  ) {
    this.user_id = user_id;
    this.vehicle_type = vehicle_type;
    this.license_plate = license_plate;
    this.is_available = is_available;
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
}
