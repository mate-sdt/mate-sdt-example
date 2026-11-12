import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * CatalogPage - Product Overview, Search, and Filtering.
 * Covers MOD-03 (Product Overview).
 */
export class CatalogPage extends BasePage {
  readonly searchInput: Locator;
  readonly searchSubmitButton: Locator;
  readonly searchResetButton: Locator;
  readonly sortSelect: Locator;
  readonly productCards: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator('[data-test="search-query"]');
    this.searchSubmitButton = page.locator('[data-test="search-submit"]');
    this.searchResetButton = page.locator('[data-test="search-reset"]');
    this.sortSelect = page.locator('[data-test="sort"]');
    this.productCards = page.locator('a.card');
  }

  async goto(): Promise<void> {
    await this.navigateTo('/');
    await expect(this.productCards.first()).toBeVisible({ timeout: 15000 });
  }

  async searchProduct(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.searchSubmitButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async selectSortOption(sortValue: string): Promise<void> {
    await this.sortSelect.selectOption(sortValue);
  }

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
    return title;
  }

  async assertProductCountGreaterThan(count: number): Promise<void> {
    await expect(async () => {
      const currentCount = await this.productCards.count();
      expect(currentCount).toBeGreaterThan(count);
    }).toPass({ timeout: 10000 });
  }
}
