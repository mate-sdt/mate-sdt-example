import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApiClient } from './base-api.client';

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  access_token?: string;
  token_type?: string;
  expires_in?: number;
  message?: string;
};

/**
 * AuthApiClient - Typed API Client for User Authentication & Registration.
 * Validates REST contracts for MOD-01 and MOD-02 against https://api.practicesoftwaretesting.com.
 */
export class AuthApiClient extends BaseApiClient {
  constructor(request: APIRequestContext) {
    super(request, '');
  }

  async login(payload: LoginRequest): Promise<APIResponse> {
    return this.post('/users/login', payload);
  }

  async register(payload: Record<string, unknown>): Promise<APIResponse> {
    return this.post('/users/register', payload);
  }

  async getProfile(accessToken: string): Promise<APIResponse> {
    return this.get('/users/me', {
      Authorization: `Bearer ${accessToken}`,
    });
  }
}
