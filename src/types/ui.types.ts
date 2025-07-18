// UI Component Types
export interface SelectOption {
  value: string | number;
  label: string;
}

// Navigation Types
export interface NavigationState {
  isNavigating: boolean;
  currentPath: string;
}

// Page Title Types
export interface PageTitleState {
  title: string;
  subtitle?: string;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "password" | "select" | "textarea";
  required?: boolean;
  options?: SelectOption[];
}

// Loading States
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

// Error States
export interface ErrorState {
  hasError: boolean;
  message: string;
  code?: string | number;
}
