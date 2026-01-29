export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const DEPARTMENT_OPTIONS = [
  'Engineering',
  'Product',
  'HR',
  'Sales',
  'Marketing',
  'Design',
  'Operations',
  'Finance',
] as const;

export const DEPARTMENT_COLORS: Record<string, string> = {
  'Engineering': '#3b82f6',
  'Product': '#8b5cf6',
  'HR': '#10b981',
  'Sales': '#f59e0b',
  'Marketing': '#ec4899',
  'Design': '#06b6d4',
  'Operations': '#6366f1',
  'Finance': '#14b8a6',
};

export const STATUS_COLORS = {
  'Present': '#10b981',
  'Absent': '#ef4444',
};

export const VALIDATION_CONSTANTS = {
  EMPLOYEE_ID: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
  },
  FULL_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },
  DEPARTMENT: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
  },
} as const;

export const DEFAULT_LOCALE = 'en-US';

export const DEFAULT_EMPLOYEE_ID = 0;
