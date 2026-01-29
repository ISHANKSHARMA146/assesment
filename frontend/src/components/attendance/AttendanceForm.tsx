import { useState, useEffect } from 'react';
import { AttendanceCreate, Employee, Attendance } from '../../types';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import { formatDate, normalizeDate } from '../../utils/helpers';
import DateInput from '../common/DateInput';
import ConfirmDialog from '../common/ConfirmDialog';

interface AttendanceFormProps {
  employees: Employee[];
  attendance: Attendance[];
  onSubmit: (data: AttendanceCreate) => Promise<void>;
  onDateChange?: () => void;
  loading?: boolean;
}

export default function AttendanceForm({ employees, attendance, onSubmit, onDateChange, loading }: AttendanceFormProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [errors, setErrors] = useState<{ date?: string }>({});
  const [confirmBulkAction, setConfirmBulkAction] = useState<{ type: 'Present' | 'Absent'; count: number } | null>(null);

  const today = new Date().toISOString().split('T')[0];

  const getAttendanceForDate = (employeeId: number, date: string): Attendance | undefined => {
    const normalizedDate = normalizeDate(date);
    return attendance.find(
      (a) => a.employee_id === employeeId && normalizeDate(a.date) === normalizedDate
    );
  };

  const handleQuickMark = async (employeeId: number, status: 'Present' | 'Absent') => {
    const existing = getAttendanceForDate(employeeId, selectedDate);
    if (existing) {
      return;
    }

    const data: AttendanceCreate = {
      employee_id: employeeId,
      date: selectedDate,
      status,
    };

    try {
      await onSubmit(data);
    } catch (error) {
      // Error handled by parent
    }
  };

  useEffect(() => {
    if (onDateChange) {
      onDateChange();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const validateDate = (): boolean => {
    const newErrors: { date?: string } = {};
    
    if (!selectedDate) {
      newErrors.date = 'Date is required';
    } else if (selectedDate > today) {
      newErrors.date = 'Date cannot be in the future';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    validateDate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const employeesToShow = employees.filter((emp) => {
    const marked = getAttendanceForDate(emp.id, selectedDate);
    return !marked;
  });

  const markedEmployees = employees.filter((emp) => {
    const marked = getAttendanceForDate(emp.id, selectedDate);
    return marked;
  });

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-primary-blue-light rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-primary-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-text-primary">Mark Attendance</h3>
          <p className="text-sm text-text-secondary">Log employee presence for the day</p>
        </div>
      </div>

      <div className="mb-4">
        <DateInput
          label="Date"
          value={selectedDate}
          max={today}
          onChange={(e) => setSelectedDate(e.target.value)}
          error={errors.date}
          disabled={loading}
        />
      </div>

      {selectedDate === today && (
        <div className="mb-4 p-3 bg-primary-blue-light rounded-lg">
          <p className="text-sm text-primary-blue font-medium">
            📅 Marking attendance for today ({formatDate(selectedDate)})
          </p>
        </div>
      )}

      {markedEmployees.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-text-primary mb-2">
            Already Marked ({markedEmployees.length})
          </h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {markedEmployees.map((emp) => {
              const marked = getAttendanceForDate(emp.id, selectedDate);
              return (
                <div
                  key={emp.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <Avatar name={emp.full_name} size={32} />
                    <div>
                      <p className="text-sm font-medium text-text-primary">{emp.full_name}</p>
                      <p className="text-xs text-text-secondary">{emp.employee_id}</p>
                    </div>
                  </div>
                  {marked && <Badge type="status" value={marked.status} />}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-text-primary">
            Pending ({employeesToShow.length})
          </h4>
          {employeesToShow.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmBulkAction({ type: 'Present', count: employeesToShow.length })}
                disabled={loading}
                className="text-xs px-2 py-1 bg-status-present text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                Mark All Present
              </button>
              <button
                onClick={() => setConfirmBulkAction({ type: 'Absent', count: employeesToShow.length })}
                disabled={loading}
                className="text-xs px-2 py-1 bg-status-absent text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                Mark All Absent
              </button>
            </div>
          )}
        </div>

        {employeesToShow.length === 0 ? (
          <div className="text-center py-8 text-text-secondary text-sm">
            All employees have been marked for {formatDate(selectedDate)}
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {employeesToShow.map((emp) => (
              <div
                key={emp.id}
                className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={emp.full_name} />
                  <div>
                    <p className="text-sm font-medium text-text-primary">{emp.full_name}</p>
                    <p className="text-xs text-text-secondary">{emp.department} • {emp.employee_id}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleQuickMark(emp.id, 'Present')}
                    disabled={loading}
                    className="px-3 py-1.5 text-sm bg-status-present text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 font-medium"
                  >
                    Present
                  </button>
                  <button
                    onClick={() => handleQuickMark(emp.id, 'Absent')}
                    disabled={loading}
                    className="px-3 py-1.5 text-sm bg-status-absent text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 font-medium"
                  >
                    Absent
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={confirmBulkAction !== null}
        title={`Mark All ${confirmBulkAction?.type}`}
        message={`Are you sure you want to mark ${confirmBulkAction?.count} employees as ${confirmBulkAction?.type}?`}
        confirmText={`Mark All ${confirmBulkAction?.type}`}
        cancelText="Cancel"
        onConfirm={() => {
          if (confirmBulkAction) {
            employeesToShow.forEach((emp) => {
              handleQuickMark(emp.id, confirmBulkAction.type);
            });
            setConfirmBulkAction(null);
          }
        }}
        onCancel={() => setConfirmBulkAction(null)}
        variant="info"
      />
    </div>
  );
}
