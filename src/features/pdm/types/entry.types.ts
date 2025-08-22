/**
 * Entry form types following Interface Segregation Principle
 * Each interface has a single, specific responsibility
 */

import { BaseProductInfo } from './base.types';

// Single Responsibility: Handle form validation state
export interface EntryFormValidation {
  readonly isValid: boolean;
  readonly errors: Record<string, string>;
}

// Single Responsibility: Handle form input state
export interface EntryFormState {
  readonly data: BaseProductInfo;
  readonly validation: EntryFormValidation;
  readonly isSubmitting: boolean;
}

// Single Responsibility: Handle form field configuration
export interface EntryFormField {
  readonly key: keyof BaseProductInfo;
  readonly label: string;
  readonly placeholder: string;
  readonly required: boolean;
  readonly maxLength?: number;
  readonly helpText?: string;
}

// Single Responsibility: Form submission callback
export interface EntryFormSubmitHandler {
  (data: BaseProductInfo): Promise<void> | void;
}

// Single Responsibility: Form reset callback
export interface EntryFormResetHandler {
  (): void;
}
