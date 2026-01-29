import { useState, useCallback } from 'react';
import api from '../services/api';
import { ApiError } from '../types';

export interface DashboardStats {
  total_employees: number;
  today_present: number;
  today_absent: number;
  today_total: number;
  recent_activity: Array<{
    id: number;
    employee_id: number;
    employee_name: string;
    employee_employee_id: string;
    date: string;
    status: string;
    created_at: string | null;
  }>;
}

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/v1/dashboard');
      setStats(response.data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    stats,
    loading,
    error,
    fetchDashboardStats,
  };
}
