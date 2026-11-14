import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';

/**
 * M.A.T.E. Framework - k6 Performance Oracle (Toolshop Catalog & Search)
 * Validates specs/product-overview.mate-spec.md SLA oracle:
 *   ORA-PERF-01: Product catalog search and filter responses must render within p95 <= 800ms.
 *
 * Run with: npx mate-sdt k6 tests/nfr/catalog-perf.k6.js
 */

const catalogLatency = new Trend('mate_catalog_duration_ms', true);
const searchLatency = new Trend('mate_search_duration_ms', true);
const catalogSuccessRate = new Rate('mate_catalog_success_rate');

export const options = {
  scenarios: {
    smoke_sla: {
      executor: 'constant-vus',
      vus: 5,
      duration: '15s',
    },
  },
  thresholds: {
    // M.A.T.E. Sacred Performance Oracles
    http_req_failed: ['rate<0.05'], // < 5% failures allowed under network jitter
    http_req_duration: ['p(95)<800', 'p(99)<1500'], // ORA-PERF-01
    mate_catalog_duration_ms: ['p(95)<800'],
    mate_search_duration_ms: ['p(95)<800'],
    mate_catalog_success_rate: ['rate>0.95'],
  },
};

const BASE_URL = __ENV.API_BASE_URL || 'https://api.practicesoftwaretesting.com';

export default function () {
  // 1. Catalog Products Query
  const catRes = http.get(`${BASE_URL}/products?page=1`);
  catalogLatency.add(catRes.timings.duration);

  const catPassed = check(catRes, {
    'ORA-PERF-01: Catalog HTTP status 200': (r) => r.status === 200,
    'ORA-PERF-01: Catalog latency < 800ms': (r) => r.timings.duration < 800,
  });
  catalogSuccessRate.add(catPassed);

  sleep(0.5);

  // 2. Search Query
  const searchRes = http.get(`${BASE_URL}/products/search?q=hammer`);
  searchLatency.add(searchRes.timings.duration);

  const searchPassed = check(searchRes, {
    'ORA-PERF-01: Search HTTP status 200': (r) => r.status === 200,
    'ORA-PERF-01: Search latency < 800ms': (r) => r.timings.duration < 800,
  });
  catalogSuccessRate.add(searchPassed);

  sleep(0.5);
}
