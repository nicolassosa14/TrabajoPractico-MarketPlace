export default class UpdateAddressCommand {
  id: string;

  user_id: string;

  lat: number;

  long: number;

  street_address?: string;

  city?: string;

  postal_code?: string;

  details?: string;

  public constructor(
    id: string,
    user_id: string,
    street_address?: string,
    city?: string,
    postal_code?: string,
    details?: string,
  ) {
    this.user_id = user_id;
    this.id = id;
    this.street_address = street_address;
    this.city = city;
    this.postal_code = postal_code;
    this.details = details;
  }
}
