import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * ProductDetailPage - Product Detail, Quantity Selector, and Add to Cart.
 * Covers MOD-04 (Product Detail & Add to Cart).
 */
export class ProductDetailPage extends BasePage {
  readonly productName: Locator;
  readonly unitPrice: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly addToFavoritesButton: Locator;
  readonly toastAlert: Locator;

  constructor(page: Page) {
    super(page);
    this.productName = page.locator('[data-test="product-name"]');
    this.unitPrice = page.locator('[data-test="unit-price"]');
    this.quantityInput = page.locator('[data-test="quantity"]');
    this.addToCartButton = page.locator('[data-test="add-to-cart"]');
    this.addToFavoritesButton = page.locator('[data-test="add-to-favorites"]');
    this.toastAlert = page.locator('[role="alert"], .alert, .toast');
  }

  async waitForProductLoaded(): Promise<void> {
    await expect(this.productName).toBeVisible({ timeout: 15000 });
  }

  async getProductName(): Promise<string> {
    return (await this.productName.textContent())?.trim() || '';
  }

  async getUnitPrice(): Promise<number> {
    const priceText = await this.unitPrice.textContent();
    const numeric = priceText?.replace(/[^0-9.]/g, '') || '0';
    return parseFloat(numeric);
  }

  async setQuantity(qty: number): Promise<void> {
    await this.quantityInput.fill(String(qty));
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
    // Wait for feedback toast or cart quantity update confirming backend persistence
    await expect(this.page.locator('[data-test="cart-quantity"]')).toBeVisible({ timeout: 10000 });
  }

  async assertAddedToCartToast(): Promise<void> {
    await expect(this.toastAlert.first()).toBeVisible({ timeout: 10000 });
  }
}
