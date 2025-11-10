import Address from './address';

describe('Address Domain Model', () => {
  describe('constructor', () => {
    it('should create an address with all required fields', () => {
      const address = new Address(
        'uuid-123',
        '123 Main Street',
        'Springfield',
        '12345',
      );

      expect(address).toBeDefined();
      expect(address.getUser_id()).toBe('uuid-123');
      expect(address.getStreet_address()).toBe('123 Main Street');
      expect(address.getCity()).toBe('Springfield');
      expect(address.getPostal_code()).toBe('12345');
    });

    it('should create an address with optional details field', () => {
      const address = new Address(
        'uuid-123',
        '123 Main Street',
        'Springfield',
        '12345',
        'Apartment 4B, Ring doorbell twice',
      );

      expect(address.getDetails()).toBe('Apartment 4B, Ring doorbell twice');
    });

    it('should create an address without details field', () => {
      const address = new Address(
        'uuid-123',
        '123 Main Street',
        'Springfield',
        '12345',
      );

      expect(address.getDetails()).toBeUndefined();
    });
  });

  describe('getters', () => {
    let address: Address;

    beforeEach(() => {
      address = new Address(
        'uuid-456',
        '456 Oak Avenue',
        'Shelbyville',
        '67890',
        'House with blue door',
      );
    });

    it('should return correct user_id', () => {
      expect(address.getUser_id()).toBe('uuid-456');
    });

    it('should return correct street_address', () => {
      expect(address.getStreet_address()).toBe('456 Oak Avenue');
    });

    it('should return correct city', () => {
      expect(address.getCity()).toBe('Shelbyville');
    });

    it('should return correct postal_code', () => {
      expect(address.getPostal_code()).toBe('67890');
    });

    it('should return correct details', () => {
      expect(address.getDetails()).toBe('House with blue door');
    });
  });

  describe('immutability', () => {
    it('should not allow modification of user_id', () => {
      const address = new Address(
        'uuid-123',
        '123 Main St',
        'Springfield',
        '12345',
      );

      const userId1 = address.getUser_id();
      const userId2 = address.getUser_id();

      expect(userId1).toBe(userId2);
      expect(userId1).toBe('uuid-123');
    });

    it('should maintain data integrity across multiple getter calls', () => {
      const address = new Address(
        'uuid-789',
        '789 Elm Street',
        'Capital City',
        '54321',
        'Gate code: 1234',
      );

      for (let i = 0; i < 5; i++) {
        expect(address.getUser_id()).toBe('uuid-789');
        expect(address.getStreet_address()).toBe('789 Elm Street');
        expect(address.getCity()).toBe('Capital City');
        expect(address.getPostal_code()).toBe('54321');
        expect(address.getDetails()).toBe('Gate code: 1234');
      }
    });
  });

  describe('edge cases', () => {
    it('should handle empty strings in required fields', () => {
      const address = new Address('', '', '', '');

      expect(address.getUser_id()).toBe('');
      expect(address.getStreet_address()).toBe('');
      expect(address.getCity()).toBe('');
      expect(address.getPostal_code()).toBe('');
    });

    it('should handle special characters in address fields', () => {
      const address = new Address(
        'uuid-special',
        '123 Main St, Apt #4B',
        "St. John's",
        'A1B 2C3',
        'Notes: Use back entrance & ring twice!',
      );

      expect(address.getStreet_address()).toBe('123 Main St, Apt #4B');
      expect(address.getCity()).toBe("St. John's");
      expect(address.getPostal_code()).toBe('A1B 2C3');
      expect(address.getDetails()).toBe(
        'Notes: Use back entrance & ring twice!',
      );
    });

    it('should handle very long strings', () => {
      const longStreet = 'A'.repeat(200);
      const longCity = 'B'.repeat(100);
      const longDetails = 'C'.repeat(500);

      const address = new Address(
        'uuid-long',
        longStreet,
        longCity,
        '12345',
        longDetails,
      );

      expect(address.getStreet_address()).toBe(longStreet);
      expect(address.getCity()).toBe(longCity);
      expect(address.getDetails()).toBe(longDetails);
    });

    it('should handle undefined details correctly', () => {
      const address = new Address(
        'uuid-123',
        '123 Main St',
        'Springfield',
        '12345',
      );

      expect(address.getDetails()).toBeUndefined();
    });

    it('should handle different postal code formats', () => {
      const usAddress = new Address('uuid-1', '123 Main', 'NY', '12345');
      const caAddress = new Address('uuid-2', '456 Oak', 'Toronto', 'M5V 1A1');
      const ukAddress = new Address('uuid-3', '789 Elm', 'London', 'SW1A 1AA');

      expect(usAddress.getPostal_code()).toBe('12345');
      expect(caAddress.getPostal_code()).toBe('M5V 1A1');
      expect(ukAddress.getPostal_code()).toBe('SW1A 1AA');
    });
  });

  describe('real world scenarios', () => {
    it('should create address for apartment with detailed delivery instructions', () => {
      const address = new Address(
        'uuid-customer1',
        '742 Evergreen Terrace, Apt 4B',
        'Springfield',
        '58008',
        'Ring doorbell twice. If no answer, leave at door. Dog friendly.',
      );

      expect(address.getUser_id()).toBe('uuid-customer1');
      expect(address.getStreet_address()).toBe(
        '742 Evergreen Terrace, Apt 4B',
      );
      expect(address.getDetails()).toContain('Ring doorbell twice');
    });

    it('should create address for business location', () => {
      const address = new Address(
        'uuid-business1',
        '1060 W Addison St',
        'Chicago',
        '60613',
        'Wrigley Field - Main entrance, ask for security',
      );

      expect(address.getCity()).toBe('Chicago');
      expect(address.getDetails()).toContain('Main entrance');
    });

    it('should create simple residential address without extra details', () => {
      const address = new Address(
        'uuid-customer2',
        '1600 Pennsylvania Avenue NW',
        'Washington',
        '20500',
      );

      expect(address.getStreet_address()).toBe(
        '1600 Pennsylvania Avenue NW',
      );
      expect(address.getDetails()).toBeUndefined();
    });
  });
});
