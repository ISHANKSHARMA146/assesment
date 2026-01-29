import { useEffect } from 'react';
import { useDashboard } from '../../hooks/useDashboard';
import { useEmployees } from '../../hooks/useEmployees';
import StatsCard from './StatsCard';
import RecentActivity from './RecentActivity';
import LoadingSpinner from '../common/LoadingSpinner';

interface DashboardProps {
  onNavigate?: (page: 'employees' | 'attendance') => void;
  onOpenEmployeeModal?: () => void;
}

export default function Dashboard({ onNavigate, onOpenEmployeeModal }: DashboardProps) {
  const { stats, loading, fetchDashboardStats } = useDashboard();
  const { fetchEmployees } = useEmployees();

  useEffect(() => {
    fetchDashboardStats();
    fetchEmployees();
  }, []);

  if (loading && !stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  const attendancePercentage =
    stats && stats.today_total > 0
      ? Math.round((stats.today_present / stats.today_total) * 100)
      : stats && stats.total_employees > 0
      ? 0
      : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Dashboard</h1>
        <p className="text-text-secondary">Overview of your HRMS Lite system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6" data-tour="dashboard-stats">
        <StatsCard
          title="Total Employees"
          value={stats?.total_employees || 0}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          }
          color="blue"
        />
        <StatsCard
          title="Today Present"
          value={stats?.today_present || 0}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          color="green"
        />
        <StatsCard
          title="Today Absent"
          value={stats?.today_absent || 0}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          color="red"
        />
        <StatsCard
          title="Attendance Rate"
          value={`${attendancePercentage}%`}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          }
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div data-tour="dashboard-recent">
          <RecentActivity activity={stats?.recent_activity || []} loading={loading} />
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => {
                onNavigate?.('employees');
                setTimeout(() => {
                  onOpenEmployeeModal?.();
                }, 100);
              }}
              className="w-full px-4 py-3 text-left bg-primary-blue-light text-primary-blue rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="font-medium">Add New Employee</span>
              </div>
            </button>
            <button
              onClick={() => onNavigate?.('attendance')}
              className="w-full px-4 py-3 text-left bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-medium">Mark Today's Attendance</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
