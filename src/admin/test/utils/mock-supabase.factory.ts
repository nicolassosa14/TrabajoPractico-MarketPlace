export class MockSupabaseFactory {
  static createMockSupabaseAdmin() {
    return {
      auth: {
        admin: {
          createUser: jest.fn(),
          listUsers: jest.fn(),
          updateUserById: jest.fn(),
          deleteUser: jest.fn(),
        },
      },
    };
  }

  static createSuccessResponse(data: any) {
    return {
      data,
      error: null,
    };
  }

  static createErrorResponse(message: string) {
    return {
      data: null,
      error: { message },
    };
  }

  static mockCreateUserSuccess(mockSupabase: any, userData: any) {
    mockSupabase.auth.admin.createUser.mockResolvedValue(
      this.createSuccessResponse({ user: userData })
    );
  }

  static mockCreateUserError(mockSupabase: any, errorMessage: string) {
    mockSupabase.auth.admin.createUser.mockResolvedValue(
      this.createErrorResponse(errorMessage)
    );
  }

  static mockListUsersSuccess(mockSupabase: any, users: any[]) {
    mockSupabase.auth.admin.listUsers.mockResolvedValue(
      this.createSuccessResponse({ users })
    );
  }

  static mockUpdateUserSuccess(mockSupabase: any, userData: any) {
    mockSupabase.auth.admin.updateUserById.mockResolvedValue(
      this.createSuccessResponse({ user: userData })
    );
  }

  static mockDeleteUserSuccess(mockSupabase: any) {
    mockSupabase.auth.admin.deleteUser.mockResolvedValue(
      this.createSuccessResponse({ success: true })
    );
  }
}