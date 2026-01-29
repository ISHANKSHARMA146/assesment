export function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export function getYesterday(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}

export function getThisWeekStart(): string {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day;
  const weekStart = new Date(today);
  weekStart.setDate(diff);
  return weekStart.toISOString().split('T')[0];
}

export function getThisWeekEnd(): string {
  return getToday();
}

export function getThisMonthStart(): string {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
}

export function getThisMonthEnd(): string {
  return getToday();
}

export interface DatePreset {
  label: string;
  fromDate: string;
  toDate: string;
}

export function getDatePresets(): DatePreset[] {
  return [
    {
      label: 'Today',
      fromDate: getToday(),
      toDate: getToday(),
    },
    {
      label: 'Yesterday',
      fromDate: getYesterday(),
      toDate: getYesterday(),
    },
    {
      label: 'This Week',
      fromDate: getThisWeekStart(),
      toDate: getThisWeekEnd(),
    },
    {
      label: 'This Month',
      fromDate: getThisMonthStart(),
      toDate: getThisMonthEnd(),
    },
  ];
}
