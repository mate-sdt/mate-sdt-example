import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export type SortOption = 'name,asc' | 'name,desc' | 'price,asc' | 'price,desc' | 'co2_rating,asc' | 'co2_rating,desc';

/**
 * CatalogPage - Product Overview, Search, Filtering, Sorting, Pagination & Price Range.
 * Covers MOD-03 (Product Overview).
 *
 * [OBSERVED] The catalog reloads through `QUERY /products` (HTTP QUERY, no query string)
 * and `GET /products/search`. Every state-changing action therefore waits on the matching
 * network response instead of sleeping.
 */
export class CatalogPage extends BasePage {
  readonly searchInput: Locator;
  readonly searchSubmitButton: Locator;
  readonly searchResetButton: Locator;
  readonly searchCaption: Locator;
  readonly noResultsMessage: Locator;
  readonly sortSelect: Locator;
  readonly productCards: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;
  readonly outOfStockLabels: Locator;
  readonly pagination: Locator;
  readonly priceSliderHandles: Locator;
  readonly filtersPanel: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator('[data-test="search-query"]');
    this.searchSubmitButton = page.locator('[data-test="search-submit"]');
    this.searchResetButton = page.locator('[data-test="search-reset"]');
    this.searchCaption = page.locator('[data-test="search-caption"]');
    this.noResultsMessage = page.locator('[data-test="no-results"]');
    this.sortSelect = page.locator('[data-test="sort"]');
    this.productCards = page.locator('a.card');
    this.productNames = page.locator('a.card [data-test="product-name"]');
    this.productPrices = page.locator('a.card [data-test="product-price"]');
    this.outOfStockLabels = page.locator('a.card [data-test="out-of-stock"]');
    this.pagination = page.locator('ul.pagination');
    this.priceSliderHandles = page.locator('ngx-slider [role="slider"]');
    // `[data-test="filters"]` is duplicated by the mobile toggle button; the panel is #filters.
    this.filtersPanel = page.locator('div#filters');
  }

  async goto(): Promise<void> {
    await this.navigateTo('/');
    await expect(this.productCards.first()).toBeVisible({ timeout: 15000 });
  }

  /** Runs `action` and resolves once the catalog data request it triggers has completed. */
  private async reloadingCatalog(action: () => Promise<void>): Promise<void> {
    const response = this.page.waitForResponse((r) =>
      /api\.practicesoftwaretesting\.com\/products(\/search)?(\?|$)/.test(r.url()),
    );
    await action();
    await response;
  }

  // ---------- Search ----------

  async searchProduct(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.reloadingCatalog(() => this.searchSubmitButton.click());
  }

  /** Submits a query that is expected NOT to hit the backend (below the minimum length). */
  async submitSearchWithoutRequest(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.searchSubmitButton.click();
  }

  async resetSearch(): Promise<void> {
    await this.reloadingCatalog(() => this.searchResetButton.click());
  }

  // ---------- Sort ----------

  async selectSortOption(sortValue: SortOption): Promise<void> {
    await this.reloadingCatalog(() => this.sortSelect.selectOption(sortValue).then(() => undefined));
  }

  // ---------- Filters ----------

  private checkbox(name: string): Locator {
    return this.filtersPanel.getByRole('checkbox', { name, exact: true });
  }

  async checkFilter(name: string): Promise<void> {
    await this.reloadingCatalog(() => this.checkbox(name).check());
  }

  async uncheckFilter(name: string): Promise<void> {
    await this.reloadingCatalog(() => this.checkbox(name).uncheck());
  }

  async assertFilterChecked(name: string, checked = true): Promise<void> {
    await expect(this.checkbox(name)).toBeChecked({ checked });
  }

  // ---------- Pagination ----------

  async goToPage(pageNumber: number): Promise<void> {
    await this.reloadingCatalog(() =>
      this.pagination.getByRole('button', { name: `Page-${pageNumber}`, exact: true }).click(),
    );
  }

  // ---------- Price range ----------

  /** Moves the upper price handle to `target` using keyboard steps (1 step = $1). */
  async setMaxPrice(target: number): Promise<void> {
    const maxHandle = this.priceSliderHandles.nth(1);
    const current = Number(await maxHandle.getAttribute('aria-valuenow'));
    const key = target < current ? 'ArrowLeft' : 'ArrowRight';
    await maxHandle.focus();
    await this.reloadingCatalog(async () => {
      for (let i = 0; i < Math.abs(current - target); i++) {
        await this.page.keyboard.press(key);
      }
    });
    await expect(maxHandle).toHaveAttribute('aria-valuenow', String(target));
  }

  async assertPriceRange(min: number, max: number, ceiling: number): Promise<void> {
    await expect(this.priceSliderHandles.nth(0)).toHaveAttribute('aria-valuenow', String(min));
    await expect(this.priceSliderHandles.nth(1)).toHaveAttribute('aria-valuenow', String(max));
    await expect(this.priceSliderHandles.nth(1)).toHaveAttribute('aria-valuemax', String(ceiling));
  }

  // ---------- Product navigation ----------

  async openProductByName(name: string): Promise<void> {
    const targetProduct = this.productCards.filter({ hasText: name }).first();
    await expect(targetProduct).toBeVisible();
    await targetProduct.click();
  }

  async openFirstProduct(): Promise<string> {
    const firstCard = this.productCards.first();
    await expect(firstCard).toBeVisible();
    const title = (await firstCard.locator('.card-title, [data-test="product-name"]').textContent())?.trim() || '';
    await firstCard.click();
    await this.page.waitForURL(/.*product\/.*/, { timeout: 15000 });
    return title;
  }

  // ---------- Readers ----------

  async getProductNames(): Promise<string[]> {
    return (await this.productNames.allTextContents()).map((n) => n.trim());
  }

  async getProductPrices(): Promise<number[]> {
    return (await this.productPrices.allTextContents()).map((p) => parseFloat(p.replace(/[^0-9.]/g, '')));
  }

  // ---------- Assertions ----------

  async assertProductCountGreaterThan(count: number): Promise<void> {
    await expect(async () => {
      const currentCount = await this.productCards.count();
      expect(currentCount).toBeGreaterThan(count);
    }).toPass({ timeout: 10000 });
  }

  async assertProductCount(count: number): Promise<void> {
    await expect(this.productCards).toHaveCount(count);
  }

  async assertCardShowsImageNamePrice(index = 0): Promise<void> {
    const card = this.productCards.nth(index);
    await expect(card.locator('img').first()).toBeVisible();
    await expect(card.locator('[data-test="product-name"]')).not.toBeEmpty();
    await expect(card.locator('[data-test="product-price"]')).toContainText(/\$\d+/);
  }

  async assertNoResults(): Promise<void> {
    await expect(this.noResultsMessage).toHaveText('There are no products found.');
    await this.assertProductCount(0);
  }
}
