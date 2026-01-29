import { Attendance, Employee } from '../../types';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import { formatDate } from '../../utils/helpers';

interface AttendanceTableProps {
  attendance: Attendance[];
  employees: Employee[];
}

export default function AttendanceTable({ attendance, employees }: AttendanceTableProps) {
  const getEmployee = (employeeId: number) => {
    return employees.find((emp) => emp.id === employeeId);
  };

  if (attendance.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary">No attendance records yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Employee Name
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Date
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((record) => {
            const employee = getEmployee(record.employee_id);
            if (!employee) return null;

            return (
              <tr
                key={record.id}
                className="border-b border-border hover:bg-gray-50 transition-colors"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={employee.full_name} />
                    <div>
                      <div className="text-sm text-text-primary font-medium">
                        {employee.full_name}
                      </div>
                      <div className="text-xs text-text-secondary">
                        {employee.department}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-text-secondary">
                  {formatDate(record.date)}
                </td>
                <td className="py-4 px-4">
                  <Badge type="status" value={record.status} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
