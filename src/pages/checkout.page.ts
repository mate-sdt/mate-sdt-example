import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export type BillingAddressData = {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  houseNumber: string;
};

/**
 * CheckoutPage - Multi-Step Checkout Wizard.
 * Covers MOD-05 (Cart Review), MOD-06 (Sign-In Gate), MOD-07 (Billing Address), MOD-08 (Payment).
 */
export class CheckoutPage extends BasePage {
  // Step 1: Cart Review
  readonly cartTable: Locator;
  readonly productTitles: Locator;
  readonly productQuantities: Locator;
  readonly linePrices: Locator;
  readonly cartTotal: Locator;
  readonly deleteButtons: Locator;
  readonly emptyCartMessage: Locator;
  readonly proceed1Button: Locator;

  // Step 2: Sign-in Gate
  readonly alreadySignedInMessage: Locator;
  readonly proceed2Button: Locator;

  // Step 3: Billing Address
  readonly streetInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly countrySelect: Locator;
  readonly postalCodeInput: Locator;
  readonly houseNumberInput: Locator;
  readonly proceed3Button: Locator;

  // Step 4: Payment
  readonly paymentMethodSelect: Locator;
  readonly finishButton: Locator;
  readonly orderConfirmation: Locator;

  constructor(page: Page) {
    super(page);
    // Step 1
    this.cartTable = page.locator('table');
    this.productTitles = page.locator('[data-test="product-title"]');
    this.productQuantities = page.locator('[data-test="product-quantity"]');
    this.linePrices = page.locator('[data-test="line-price"]');
    this.cartTotal = page.locator('[data-test="cart-total"]');
    this.deleteButtons = page.locator('button.btn-danger, [data-test="delete-item"], a:has(fa-icon[icon="trash"])');
    this.emptyCartMessage = page.locator('text=/shopping cart is empty/i, [data-test="cart-empty"]');
    this.proceed1Button = page.locator('[data-test="proceed-1"]');

    // Step 2
    this.alreadySignedInMessage = page.locator('text=/already signed in as/i, [data-test="signed-in-user"]');
    this.proceed2Button = page.locator('[data-test="proceed-2"]');

    // Step 3
    this.streetInput = page.locator('[data-test="street"]');
    this.cityInput = page.locator('[data-test="city"]');
    this.stateInput = page.locator('[data-test="state"]');
    this.countrySelect = page.locator('[data-test="country"]');
    this.postalCodeInput = page.locator('[data-test="postal_code"]');
    this.houseNumberInput = page.locator('[data-test="house_number"]');
    this.proceed3Button = page.locator('[data-test="proceed-3"]');

    // Step 4
    this.paymentMethodSelect = page.locator('[data-test="payment-method"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.orderConfirmation = page.locator('[data-test="payment-success"], .alert-success, h2:has-text("Thanks"), h3:has-text("Confirmation")');
  }

  async goto(): Promise<void> {
    await this.navigateTo('/checkout');
    await expect(this.page.locator('app-checkout')).toBeVisible({ timeout: 15000 });
  }

  async proceedToSignIn(): Promise<void> {
    await expect(this.proceed1Button).toBeVisible({ timeout: 10000 });
    await this.proceed1Button.click();
  }

  async proceedToAddress(): Promise<void> {
    // If not signed in yet, sign in directly on Step 2
    const loginEmail = this.page.locator('[data-test="email"]');
    if (await loginEmail.isVisible()) {
      const email = process.env.TEST_USER_EMAIL || 'customer2@practicesoftwaretesting.com';
      const password = process.env.TEST_USER_PASSWORD || 'welcome01';
      await loginEmail.fill(email);
      await this.page.locator('[data-test="password"]').fill(password);
      await this.page.locator('[data-test="login-submit"]').click();
    }
    await expect(this.proceed2Button).toBeVisible({ timeout: 10000 });
    await this.proceed2Button.click();
  }

  async fillBillingAddress(data: BillingAddressData): Promise<void> {
    if (data.country) {
      // select by label or value
      await this.countrySelect.selectOption({ label: data.country }).catch(async () => {
        await this.countrySelect.selectOption(data.country);
      });
    }
    if (data.postalCode) await this.postalCodeInput.fill(data.postalCode);
    if (data.houseNumber) await this.houseNumberInput.fill(data.houseNumber);
    if (data.street) await this.streetInput.fill(data.street);
    if (data.city) await this.cityInput.fill(data.city);
    if (data.state) await this.stateInput.fill(data.state);
  }

  async proceedToPayment(): Promise<void> {
    await expect(this.proceed3Button).toBeVisible({ timeout: 10000 });
    await this.proceed3Button.click();
  }

  async selectPaymentMethod(methodLabel: string): Promise<void> {
    await expect(this.paymentMethodSelect).toBeVisible({ timeout: 10000 });
    await this.paymentMethodSelect.selectOption({ label: methodLabel });
  }

  async confirmOrder(): Promise<void> {
    await expect(this.finishButton).toBeVisible({ timeout: 10000 });
    await this.finishButton.click();
  }

  async assertOrderConfirmed(): Promise<void> {
    await expect(this.orderConfirmation.first()).toBeVisible({ timeout: 15000 });
  }

  async assertProceed3Disabled(): Promise<void> {
    await expect(this.proceed3Button).toBeDisabled({ timeout: 5000 });
  }
}
