import { test, expect } from '@playwright/test';

/**
 * Pillar T: Threat, Concurrency & Adversarial Suite
 * Governed by specs/user-login.mate-spec.md and specs/product-overview.mate-spec.md
 *
 * Focuses on:
 * - THR-AUTH-01: Rapid-fire brute-force resistance (INV-03 barrier)
 * - THR-AUTH-03: Vertical privilege escalation & BOLA authorization enforcement (INV-06)
 * - THREAT-OVR-01: Search injection payload fuzzing (SQLi, XSS, Unicode, length boundary)
 */

test.describe('Pillar T: Threat & Adversarial Security Suite @threats @security', () => {
  const API_BASE = 'https://api.practicesoftwaretesting.com';

  test('THR-AUTH-01: Brute-force credential burst fails gracefully without server crash [INV-03]', async ({ request }) => {
    // Attempt rapid consecutive failed logins for the same account
    const attempts = Array.from({ length: 5 }, (_, i) =>
      request.post(`${API_BASE}/users/login`, {
        data: {
          email: 'customer@practicesoftwaretesting.com',
          password: `invalid-password-attempt-${i}-${Date.now()}`,
        },
      })
    );

    const responses = await Promise.all(attempts);

    for (const res of responses) {
      // Invariant: Status must be client failure (401 Unauthorized or 423 Locked), never 5xx
      expect([401, 422, 423, 429]).toContain(res.status());
      const body = await res.json();
      expect(body).not.toHaveProperty('stack');
      expect(body).not.toHaveProperty('trace');
    }
  });

  test('THR-AUTH-03: BOLA / Vertical Privilege Escalation Probe [INV-06]', async ({ request }) => {
    // 1. Authenticate as regular customer
    const loginRes = await request.post(`${API_BASE}/users/login`, {
      data: {
        email: 'customer@practicesoftwaretesting.com',
        password: 'welcome01',
      },
    });

    expect(loginRes.status()).toBe(200);
    const { access_token } = await loginRes.json();
    expect(typeof access_token).toBe('string');
    expect(access_token.length).toBeGreaterThan(20);

    // 2. Probe protected admin endpoint with customer token
    const adminProbe = await request.get(`${API_BASE}/reports/total-sales-per-country`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    // Invariant: Must return 401 Unauthorized or 403 Forbidden (never 200 or 500)
    expect([401, 403]).toContain(adminProbe.status());
  });

  test('THREAT-OVR-01: Search & catalog payload fuzzing resistance [INV-02]', async ({ request }) => {
    const maliciousPayloads = [
      '<script>alert("xss")</script>',
      "'; DROP TABLE products; --",
      "' OR '1'='1",
      'A'.repeat(5000), // Buffer overflow probe
      '🔥🔨🪓🔩'.repeat(100), // Unicode stress probe
    ];

    for (const payload of maliciousPayloads) {
      const encoded = encodeURIComponent(payload);
      const res = await request.get(`${API_BASE}/products/search?q=${encoded}`);

      // Invariant: Server must handle fuzzing gracefully (200 empty result, 400 Bad Request, or 422 Unprocessable)
      // and NEVER crash with 500 or leak stack traces
      expect([200, 400, 422]).toContain(res.status());

      const text = await res.text();
      expect(text).not.toContain('SQLSTATE');
      expect(text).not.toContain('Exception');
      expect(text).not.toContain('Trace:');
    }
  });
});
