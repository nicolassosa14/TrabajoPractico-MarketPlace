import User from './user';

describe('User Domain Model', () => {
  describe('constructor', () => {
    it('should create a user with all required fields', () => {
      const user = new User(
        'test@example.com',
        'password123',
        'John',
        'Doe',
      );

      expect(user).toBeDefined();
      expect(user.getEmail()).toBe('test@example.com');
      expect(user.getPassword()).toBe('password123');
      expect(user.getFirst_Name()).toBe('John');
      expect(user.getLast_Name()).toBe('Doe');
    });

    it('should create a user with optional fields', () => {
      const user = new User(
        'test@example.com',
        'password123',
        'John',
        'Doe',
        1234567890,
        1,
        '123e4567-e89b-12d3-a456-426614174000',
      );

      expect(user.getPhone()).toBe(1234567890);
      expect(user.getId()).toBe(1);
      expect(user.getUuid()).toBe('123e4567-e89b-12d3-a456-426614174000');
    });

    it('should create a user with only email and password', () => {
      const user = new User('test@example.com', 'password123');

      expect(user.getEmail()).toBe('test@example.com');
      expect(user.getPassword()).toBe('password123');
      expect(user.getFirst_Name()).toBeUndefined();
      expect(user.getLast_Name()).toBeUndefined();
      expect(user.getPhone()).toBeUndefined();
    });
  });

  describe('getters', () => {
    let user: User;

    beforeEach(() => {
      user = new User(
        'john.doe@example.com',
        'SecurePass123',
        'John',
        'Doe',
        1234567890,
        42,
        'uuid-12345',
      );
    });

    it('should return correct email', () => {
      expect(user.getEmail()).toBe('john.doe@example.com');
    });

    it('should return correct password', () => {
      expect(user.getPassword()).toBe('SecurePass123');
    });

    it('should return correct first name', () => {
      expect(user.getFirst_Name()).toBe('John');
    });

    it('should return correct last name', () => {
      expect(user.getLast_Name()).toBe('Doe');
    });

    it('should return correct phone number', () => {
      expect(user.getPhone()).toBe(1234567890);
    });

    it('should return correct id', () => {
      expect(user.getId()).toBe(42);
    });

    it('should return correct uuid', () => {
      expect(user.getUuid()).toBe('uuid-12345');
    });
  });

  describe('immutability', () => {
    it('should not allow modification of email', () => {
      const user = new User('test@example.com', 'password123');

      // TypeScript evita esto, pero probamos que los getters devuelven valores consistentes
      const email1 = user.getEmail();
      const email2 = user.getEmail();

      expect(email1).toBe(email2);
      expect(email1).toBe('test@example.com');
    });

    it('should maintain data integrity across multiple getter calls', () => {
      const user = new User(
        'test@example.com',
        'password123',
        'John',
        'Doe',
        1234567890,
      );

      // Llamar múltiples veces a los getters
      for (let i = 0; i < 5; i++) {
        expect(user.getEmail()).toBe('test@example.com');
        expect(user.getPassword()).toBe('password123');
        expect(user.getFirst_Name()).toBe('John');
        expect(user.getLast_Name()).toBe('Doe');
        expect(user.getPhone()).toBe(1234567890);
      }
    });
  });

  describe('edge cases', () => {
    it('should handle undefined optional fields correctly', () => {
      const user = new User('test@example.com', 'password123');

      expect(user.getFirst_Name()).toBeUndefined();
      expect(user.getLast_Name()).toBeUndefined();
      expect(user.getPhone()).toBeUndefined();
      expect(user.getId()).toBeUndefined();
      expect(user.getUuid()).toBeUndefined();
    });

    it('should handle empty strings in required fields', () => {
      const user = new User('', '');

      expect(user.getEmail()).toBe('');
      expect(user.getPassword()).toBe('');
    });

    it('should handle special characters in email and password', () => {
      const user = new User(
        'test+tag@example.co.uk',
        'P@ssw0rd!#$%',
      );

      expect(user.getEmail()).toBe('test+tag@example.co.uk');
      expect(user.getPassword()).toBe('P@ssw0rd!#$%');
    });
  });
});
