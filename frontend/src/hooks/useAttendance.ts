import { useState, useCallback } from 'react';
import api from '../services/api';
import { Attendance, AttendanceCreate, ApiError } from '../types';

interface AttendanceFilters {
  employee_id?: number;
  from_date?: string;
  to_date?: string;
  departments?: string[];
}

export function useAttendance() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendance = useCallback(async (filters?: AttendanceFilters) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters?.employee_id) {
        params.append('employee_id', filters.employee_id.toString());
      }
      if (filters?.from_date) {
        params.append('from_date', filters.from_date);
      }
      if (filters?.to_date) {
        params.append('to_date', filters.to_date);
      }
      if (filters?.departments && filters.departments.length > 0) {
        filters.departments.forEach((dept) => {
          params.append('departments', dept);
        });
      }
      
      const response = await api.get(`/api/v1/attendance?${params.toString()}`);
      setAttendance(response.data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllAttendance = useCallback(async (): Promise<Attendance[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/v1/attendance');
      return response.data;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const markAttendance = useCallback(async (data: AttendanceCreate): Promise<Attendance | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/v1/attendance', data);
      const newAttendance = response.data;
      setAttendance((prev) => [newAttendance, ...prev]);
      return newAttendance;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    attendance,
    loading,
    error,
    fetchAttendance,
    fetchAllAttendance,
    markAttendance,
  };
}
