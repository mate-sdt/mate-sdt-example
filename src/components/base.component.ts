import { Locator } from '@playwright/test';

/**
 * M.A.T.E. Framework - Base Component Object (BaseComponent)
 * Implements Single Responsibility (SRP) for reusable UI widgets.
 */
export abstract class BaseComponent {
  readonly rootLocator: Locator;

  constructor(rootLocator: Locator) {
    this.rootLocator = rootLocator;
  }
}
