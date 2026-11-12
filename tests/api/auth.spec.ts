import { test, expect } from '../../src/fixtures/mate.fixtures';

/**
 * 🧪 MOD-01 & MOD-02: Authentication & Registration (API Contract Suite)
 * Validates backend contracts against https://api.practicesoftwaretesting.com.
 * Covers: AC2, AC3, AC5 (Registration), AC2, AC3, AC4 (Login)
 */

test.describe('MOD-01 & MOD-02: Authentication API Contracts @api', () => {

  test('API-AUTH-01: Valid Customer Login Contract (HTTP 200)', async ({ authApiClient }) => {
    const email = process.env.TEST_USER_EMAIL || 'customer@practicesoftwaretesting.com';
    const password = process.env.TEST_USER_PASSWORD || 'welcome01';

    const response = await authApiClient.login({ email, password });
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('access_token');
    expect(body).toHaveProperty('token_type', 'bearer');
    expect(body.expires_in).toBeGreaterThan(0);
  });

  test('API-AUTH-02: Invalid Credentials Contract (HTTP 401)', async ({ authApiClient }) => {
    const response = await authApiClient.login({
      email: 'customer@practicesoftwaretesting.com',
      password: 'IncorrectPassword999!',
    });

    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  test('API-AUTH-03: Duplicate Email Registration Rejection (HTTP 422) [INV-04]', async ({ authApiClient }) => {
    const response = await authApiClient.register({
      first_name: 'Jane',
      last_name: 'Doe',
      dob: '1985-02-10',
      address: 'Main Street 1',
      city: 'Amsterdam',
      state: 'North Holland',
      country: 'NL',
      postcode: '1012AB',
      phone: '0687654321',
      email: 'customer@practicesoftwaretesting.com',
      password: 'UniqueP@ssword2026!#$%',
    });

    // AC5 / INV-04: HTTP 422 Unprocessable Entity
    expect(response.status()).toBe(422);
    const body = await response.json();
    expect(body).toHaveProperty('email');
    expect(JSON.stringify(body.email)).toContain('already exists');
  });

  test('API-AUTH-04: Protected Profile Access with Bearer Token (HTTP 200)', async ({ authApiClient }) => {
    const email = process.env.TEST_USER_EMAIL || 'customer@practicesoftwaretesting.com';
    const password = process.env.TEST_USER_PASSWORD || 'welcome01';

    // 1. Authenticate to obtain JWT token
    const loginResponse = await authApiClient.login({ email, password });
    const { access_token } = await loginResponse.json();

    // 2. Query protected endpoint /users/me
    const profileResponse = await authApiClient.getProfile(access_token);
    expect(profileResponse.status()).toBe(200);

    const profile = await profileResponse.json();
    expect(profile.email).toBe(email);
  });

});
