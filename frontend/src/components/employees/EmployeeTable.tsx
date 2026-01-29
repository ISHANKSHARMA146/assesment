import { Employee } from '../../types';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';

interface EmployeeTableProps {
  employees: Employee[];
  onDelete: (id: number) => void;
  deletingId?: number;
  isSearchResult?: boolean;
}

export default function EmployeeTable({ employees, onDelete, deletingId, isSearchResult }: EmployeeTableProps) {

  if (employees.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary">
          {isSearchResult ? 'No employees found matching your search. Try a different search term.' : 'No employees yet. Add your first employee.'}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Employee ID
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Full Name
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Email
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Department
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr
              key={employee.id}
              className="border-b border-border hover:bg-gray-50 transition-colors"
            >
              <td className="py-4 px-4 text-sm text-text-primary font-medium">
                {employee.employee_id}
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  <Avatar name={employee.full_name} />
                  <span className="text-sm text-text-primary font-medium">
                    {employee.full_name}
                  </span>
                </div>
              </td>
              <td className="py-4 px-4 text-sm text-text-secondary">
                {employee.email}
              </td>
              <td className="py-4 px-4">
                <Badge type="department" value={employee.department} />
              </td>
              <td className="py-4 px-4">
                <button
                  onClick={() => onDelete(employee.id)}
                  disabled={deletingId === employee.id}
                  className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                  title="Delete employee"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
