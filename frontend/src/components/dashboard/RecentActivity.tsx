import { DashboardStats } from '../../hooks/useDashboard';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import { formatDate } from '../../utils/helpers';

interface RecentActivityProps {
  activity: DashboardStats['recent_activity'];
  loading?: boolean;
}

export default function RecentActivity({ activity, loading }: RecentActivityProps) {
  if (loading) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activity.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Recent Activity</h3>
        <div className="text-center py-8 text-text-secondary text-sm">
          No recent activity
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {activity.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Avatar name={item.employee_name} size={40} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                {item.employee_name}
              </p>
              <p className="text-xs text-text-secondary">
                {formatDate(item.date)} • {item.employee_employee_id}
              </p>
            </div>
            <Badge type="status" value={item.status} />
          </div>
        ))}
      </div>
    </div>
  );
}
