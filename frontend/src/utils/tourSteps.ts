import { Step } from 'react-joyride';

export const tourSteps: Step[] = [
  {
    target: '[data-tour="dashboard-stats"]',
    content: 'Welcome to HRMS Lite! This dashboard shows key metrics including total employees and today\'s attendance summary.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="dashboard-recent"]',
    content: 'View recent attendance activity here. This helps you track who has been marking attendance recently.',
    placement: 'left',
  },
  {
    target: '[data-tour="nav-employees"]',
    content: 'Click here to manage employees. You can add, view, and delete employee records.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="nav-attendance"]',
    content: 'Click here to mark and view attendance records for all employees.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="employee-list"]',
    content: 'This is the employee directory. You can search for employees and add new ones using the button above.',
    placement: 'top',
  },
  {
    target: '[data-tour="attendance-form"]',
    content: 'Mark attendance here. Select a date and click Present or Absent for each employee. Use "Mark All" for quick bulk actions.',
    placement: 'left',
  },
  {
    target: '[data-tour="attendance-history"]',
    content: 'View and filter attendance history here. Use the search and date filters to find specific records.',
    placement: 'right',
  },
];
