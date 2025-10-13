export class TestUtils {
  static generateMockAdmin(overrides?: any) {
    return {
      id: overrides?.id || 'mock-id-123',
      email: overrides?.email || 'mock@example.com',
      password: overrides?.password || 'mockPassword123',
      role: overrides?.role || 'vendor',
      user_metadata: {
        role: overrides?.role || 'vendor',
      },
      ...overrides,
    };
  }

  static generateMockSupabaseResponse(data: any = null, error: any = null) {
    return {
      data,
      error,
    };
  }

  static generateRandomEmail(prefix: string = 'test'): string {
    return `${prefix}-${Date.now()}@example.com`;
  }

  static generateValidCreateDto(overrides?: any) {
    return {
      email: overrides?.email || TestUtils.generateRandomEmail(),
      password: overrides?.password || 'SecurePassword123!',
      role: overrides?.role || 'vendor',
      ...overrides,
    };
  }

  static generateValidUpdateDto(overrides?: any) {
    return {
      id: overrides?.id || 'test-id-123',
      email: overrides?.email || TestUtils.generateRandomEmail(),
      role: overrides?.role || 'vendor',
      ...overrides,
    };
  }
}