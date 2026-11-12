import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * CartPage - Checkout Cart Review and Multi-Step Wizard.
 * Covers MOD-05 (Cart Review), MOD-06 (Sign In Gate), MOD-07 (Address), MOD-08 (Payment).
 */
export class CartPage extends BasePage {
  readonly productTitles: Locator;
  readonly productQuantities: Locator;
  readonly linePrices: Locator;
  readonly cartTotal: Locator;
  readonly proceedToStep2Button: Locator;
  readonly proceedToStep3Button: Locator;
  readonly proceedToStep4Button: Locator;

  constructor(page: Page) {
    super(page);
    this.productTitles = page.locator('[data-test="product-title"]');
    this.productQuantities = page.locator('[data-test="product-quantity"]');
    this.linePrices = page.locator('[data-test="line-price"]');
    this.cartTotal = page.locator('[data-test="cart-total"]');
    this.proceedToStep2Button = page.locator('[data-test="proceed-1"]');
    this.proceedToStep3Button = page.locator('[data-test="proceed-2"]');
    this.proceedToStep4Button = page.locator('[data-test="proceed-3"]');
  }

  async goto(): Promise<void> {
    const navCart = this.page.locator('[data-test="nav-cart"]');
    if (await navCart.isVisible()) {
      await navCart.click();
    } else {
      await this.navigateTo('/checkout');
    }
    await expect(this.cartTotal).toBeVisible({ timeout: 15000 });
  }

  async getCartTotal(): Promise<number> {
    const text = await this.cartTotal.textContent();
    const numeric = text?.replace(/[^0-9.]/g, '') || '0';
    return parseFloat(numeric);
  }

  async proceedToSignInStep(): Promise<void> {
    await expect(this.proceedToStep2Button).toBeVisible();
    await this.proceedToStep2Button.click();
  }

  async assertItemInCart(productName: string): Promise<void> {
    await expect(this.productTitles.filter({ hasText: productName }).first()).toBeVisible({ timeout: 10000 });
  }

  async assertCartTotalGreaterThanZero(): Promise<void> {
    await expect(async () => {
      const total = await this.getCartTotal();
      expect(total).toBeGreaterThan(0);
    }).toPass({ timeout: 10000 });
  }
}
