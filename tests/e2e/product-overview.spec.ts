import { test, expect } from '../../src/fixtures/mate.fixtures';

/**
 * MOD-03: Product Overview, Search, Filters, Sort & Price Range (E2E UI Suite)
 * Spec: specs/product-overview.mate-spec.md | Cases: docs/test-cases/TC-product-overview.md
 * Covers: AC1-AC11 (AC12 / AC13 are data-dependent and tracked as manual cases)
 * Invariants: INV-01..INV-05
 */

const isSortedBy = <T>(values: T[], cmp: (a: T, b: T) => number): boolean =>
  values.every((v, i) => i === 0 || cmp(values[i - 1], v) <= 0);

test.describe('MOD-03: Product Overview', () => {
  test.beforeEach(async ({ catalogPage }) => {
    await catalogPage.goto();
  });

  test('TC-OVR-01: Product grid shows image, name and price on every card @p0', async ({ catalogPage }) => {
    // AC1 / INV-01
    await catalogPage.assertProductCount(9);
    for (let i = 0; i < 9; i++) {
      await catalogPage.assertCardShowsImageNamePrice(i);
    }
  });

  test('TC-OVR-02: Clicking a product card opens its detail page @p0', async ({ catalogPage }) => {
    // AC2
    const name = await catalogPage.openFirstProduct();
    await catalogPage.assertUrl(/.*\/product\/.+/);
    await expect(catalogPage.page.locator('[data-test="product-name"]')).toHaveText(name);
  });

  test('TC-OVR-03: Pagination controls update the product grid @p1', async ({ catalogPage }) => {
    // AC3
    await expect(catalogPage.pagination).toBeVisible();
    const firstPageNames = await catalogPage.getProductNames();
    await catalogPage.goToPage(2);
    await expect.poll(() => catalogPage.getProductNames()).not.toEqual(firstPageNames);
  });

  test('TC-OVR-04: Valid search (3 characters) filters the grid and shows the caption @p0', async ({ catalogPage }) => {
    // AC4
    await catalogPage.searchProduct('ham');
    await expect(catalogPage.searchCaption).toHaveText('Searched for: ham');
    await catalogPage.assertProductCountGreaterThan(0);
  });

  test('TC-OVR-05: Search accepts the 40-character upper boundary @p1', async ({ catalogPage }) => {
    // AC4 border: max length
    const query = 'x'.repeat(40);
    await catalogPage.searchProduct(query);
    await expect(catalogPage.searchCaption).toHaveText(`Searched for: ${query}`);
  });

  test('TC-OVR-06: Search below the 3-character minimum does not trigger a search @p1', async ({ catalogPage }) => {
    // AC4 border: min-1 length (INV-02)
    await catalogPage.submitSearchWithoutRequest('ha');
    await expect(catalogPage.searchCaption).toBeHidden();
    await catalogPage.assertProductCount(9);
  });

  test('TC-OVR-07: Search with no matches shows the empty state @p0', async ({ catalogPage }) => {
    // AC4 negative
    await catalogPage.searchProduct('zzzzqqq');
    await catalogPage.assertNoResults();
  });

  test('TC-OVR-08: Search payloads (XSS / SQLi) are treated as plain text @p1', async ({ catalogPage }) => {
    // AC4 negative / security: no script execution, no server error
    for (const payload of ['<script>alert(1)</script>', "' OR 1=1 --"]) {
      await catalogPage.searchProduct(payload);
      await expect(catalogPage.searchCaption).toHaveText(`Searched for: ${payload}`);
      await catalogPage.assertNoResults();
    }
  });

  test('TC-OVR-20: Whitespace-only search is accepted and shows the empty state (DEC-OVR-01) @p2', async ({
    catalogPage,
  }) => {
    // AC4 border. DEC-OVR-01 (2026-11-12, provisional): no trimming; 3 spaces is a valid, executed search.
    // If Product later defines trimming, update the spec first, then flip this expectation.
    const query = '   ';
    await catalogPage.searchProduct(query);
    await expect(catalogPage.searchCaption).toHaveText(`Searched for: ${query}`);
    await catalogPage.assertNoResults();
  });

  test('TC-OVR-09: Searching resets all active filters @p1', async ({ catalogPage }) => {
    // AC4 "all active filters are reset" (INV-03)
    await catalogPage.checkFilter('Hammer');
    await catalogPage.searchProduct('pliers');
    await catalogPage.assertFilterChecked('Hammer', false);
    await expect.poll(async () => (await catalogPage.getProductNames()).every((n) => /pliers/i.test(n))).toBe(true);
  });

  test('TC-OVR-10: Category filter restricts the grid to the chosen category @p0', async ({ catalogPage }) => {
    // AC5
    await catalogPage.checkFilter('Hammer');
    await expect.poll(async () => {
      const names = await catalogPage.getProductNames();
      return names.length > 0 && names.every((n) => /hammer/i.test(n));
    }).toBe(true);
  });

  test('TC-OVR-11: Parent category selects all children; unchecking all children unchecks the parent @p1', async ({
    catalogPage,
  }) => {
    // AC6 (INV-04)
    const children = ['Hammer', 'Hand Saw', 'Wrench', 'Screwdriver', 'Pliers', 'Chisels', 'Measures'];
    await catalogPage.checkFilter('Hand Tools');
    for (const child of children) {
      await catalogPage.assertFilterChecked(child);
    }
    for (const child of children) {
      await catalogPage.uncheckFilter(child);
    }
    await catalogPage.assertFilterChecked('Hand Tools', false);
  });

  test('TC-OVR-12: Brand filter narrows the grid to the selected brand @p1', async ({ catalogPage }) => {
    // AC7
    const unfiltered = await catalogPage.getProductNames();
    await catalogPage.checkFilter('ForgeFlex Tools');
    await expect.poll(() => catalogPage.getProductNames()).not.toEqual(unfiltered);
    await catalogPage.assertProductCountGreaterThan(0);
  });

  test('TC-OVR-13: Category and brand filters combine as an intersection @p1', async ({ catalogPage }) => {
    // AC8 (INV-05)
    await catalogPage.checkFilter('Hammer');
    await expect.poll(async () => (await catalogPage.getProductNames()).length).toBeGreaterThan(0);
    const hammersOnly = await catalogPage.getProductNames();

    await catalogPage.checkFilter('ForgeFlex Tools');
    await expect.poll(async () => {
      const names = await catalogPage.getProductNames();
      return names.length > 0 && names.every((n) => hammersOnly.includes(n));
    }).toBe(true);
  });

  test('TC-OVR-14: Sort by name A-Z and Z-A orders the grid alphabetically @p0', async ({ catalogPage }) => {
    // AC9
    await catalogPage.selectSortOption('name,asc');
    await expect.poll(async () => isSortedBy(await catalogPage.getProductNames(), (a, b) => a.localeCompare(b))).toBe(true);

    await catalogPage.selectSortOption('name,desc');
    await expect.poll(async () => isSortedBy(await catalogPage.getProductNames(), (a, b) => b.localeCompare(a))).toBe(true);
  });

  test('TC-OVR-15: Sort by price low-high and high-low orders the grid by price @p0', async ({ catalogPage }) => {
    // AC9
    await catalogPage.selectSortOption('price,asc');
    await expect.poll(async () => isSortedBy(await catalogPage.getProductPrices(), (a, b) => a - b)).toBe(true);

    await catalogPage.selectSortOption('price,desc');
    await expect.poll(async () => isSortedBy(await catalogPage.getProductPrices(), (a, b) => b - a)).toBe(true);
  });

  test('TC-OVR-16: Price slider defaults to $1-$100 with a $200 ceiling @p1', async ({ catalogPage }) => {
    // AC10
    await catalogPage.assertPriceRange(1, 100, 200);
  });

  test('TC-OVR-17: Lowering the max price handle restricts products to the range @p1', async ({ catalogPage }) => {
    // AC11 (INV-06)
    await catalogPage.setMaxPrice(10);
    await expect.poll(async () => {
      const prices = await catalogPage.getProductPrices();
      return prices.length > 0 && prices.every((p) => p >= 1 && p <= 10);
    }).toBe(true);
  });
});
