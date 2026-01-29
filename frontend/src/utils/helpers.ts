import { DEPARTMENT_COLORS, DEFAULT_LOCALE } from './constants';

const INITIALS_LENGTH = 2;
const MIN_NAME_PARTS_FOR_INITIALS = 2;

export function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length >= MIN_NAME_PARTS_FOR_INITIALS) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, INITIALS_LENGTH).toUpperCase();
}

export function getDepartmentColor(department: string): string {
  return DEPARTMENT_COLORS[department] || '#6b7280';
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(DEFAULT_LOCALE, { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

export function getAvatarColor(name: string): string {
  const colors = [
    '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', 
    '#ec4899', '#06b6d4', '#6366f1', '#14b8a6'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function normalizeDate(date: string | Date): string {
  if (typeof date === 'string') {
    return date.split('T')[0];
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
