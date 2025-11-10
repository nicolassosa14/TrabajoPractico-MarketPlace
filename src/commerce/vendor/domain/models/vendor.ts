export default class Vendor {
  constructor(
    private name: string,
    private description: string,
    private address: string,
    private is_active: boolean,
    private user_id: string,
    private image_url?: string,
    private id?: string
  ) {}

  getName() { return this.name }
  getDescription() { return this.description }
  getAddress() { return this.address }
  getIsActive() { return this.is_active }
  getUserId() { return this.user_id }
  getImageUrl() { return this.image_url }
  getId() { return this.id }
}