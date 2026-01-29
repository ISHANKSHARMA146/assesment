import { useEffect, useState, useCallback, useRef } from 'react';
import { useAttendance } from '../../hooks/useAttendance';
import { useEmployees } from '../../hooks/useEmployees';
import AttendanceForm from './AttendanceForm';
import AttendanceHistory from './AttendanceHistory';
import Toast from '../common/Toast';
import { AttendanceCreate, ApiError, Attendance } from '../../types';

export default function AttendanceManagement() {
  const { employees, fetchEmployees } = useEmployees();
  const { attendance: historyAttendance, loading, fetchAttendance, fetchAllAttendance, markAttendance } = useAttendance();
  const [formAttendance, setFormAttendance] = useState<Attendance[]>([]);
  const [toast, setToast] = useState<{ message: string; messages?: string[]; type: 'success' | 'error' } | null>(null);
  const [filters, setFilters] = useState<{ employee_id?: number; from_date?: string; to_date?: string; departments?: string[] }>({});
  const filtersRef = useRef(filters);

  // Keep filters ref in sync
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchAllAttendance().then(setFormAttendance);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchAttendance(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.employee_id, filters.from_date, filters.to_date, filters.departments?.join(',')]);

  const handleMarkAttendance = async (data: AttendanceCreate) => {
    try {
      await markAttendance(data);
      setToast({ message: 'Attendance marked successfully', type: 'success' });
      fetchAllAttendance().then(setFormAttendance);
      fetchAttendance(filtersRef.current);
    } catch (err) {
      const apiError = err as ApiError;
      setToast({ 
        message: apiError.message, 
        messages: apiError.messages,
        type: 'error' 
      });
      throw err;
    }
  };

  const handleDateChange = useCallback(() => {
    fetchAllAttendance().then(setFormAttendance);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Attendance Management</h1>
        <p className="text-text-secondary">Record, view, and manage daily employee attendance records.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div data-tour="attendance-form">
          <AttendanceForm
            employees={employees}
            attendance={formAttendance}
            onSubmit={handleMarkAttendance}
            onDateChange={handleDateChange}
            loading={loading}
          />
        </div>
        <div data-tour="attendance-history">
          <AttendanceHistory
            attendance={historyAttendance}
            employees={employees}
            loading={loading}
            onFilterChange={setFilters}
          />
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          messages={toast.messages}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
