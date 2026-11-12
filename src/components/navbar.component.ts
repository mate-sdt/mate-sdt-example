import { Page, Locator, expect } from '@playwright/test';
import { BaseComponent } from './base.component';

/**
 * NavbarComponent - Encapsulates top navigation header across all pages.
 */
export class NavbarComponent extends BaseComponent {
  readonly homeLink: Locator;
  readonly categoriesDropdown: Locator;
  readonly contactLink: Locator;
  readonly signInLink: Locator;
  readonly userMenu: Locator;
  readonly cartLink: Locator;
  readonly cartQuantityBadge: Locator;

  constructor(page: Page) {
    super(page.locator('app-header, nav.navbar').first());
    this.homeLink = page.locator('[data-test="nav-home"]');
    this.categoriesDropdown = page.locator('[data-test="nav-categories"]');
    this.contactLink = page.locator('[data-test="nav-contact"]');
    this.signInLink = page.locator('[data-test="nav-sign-in"]');
    this.userMenu = page.locator('[data-test="nav-menu"]');
    this.cartLink = page.locator('[data-test="nav-cart"]');
    this.cartQuantityBadge = page.locator('[data-test="cart-quantity"]');
  }

  async navigateToHome(): Promise<void> {
    await this.homeLink.click();
  }

  async navigateToSignIn(): Promise<void> {
    await this.signInLink.click();
  }

  async navigateToCart(): Promise<void> {
    await this.cartLink.click();
  }

  async assertCartQuantity(expectedCount: number): Promise<void> {
    await expect(this.cartQuantityBadge).toBeVisible();
    await expect(this.cartQuantityBadge).toHaveText(String(expectedCount));
  }

  async assertUserLoggedIn(displayName: string): Promise<void> {
    await expect(this.userMenu).toBeVisible();
    await expect(this.userMenu).toContainText(displayName);
  }
}
