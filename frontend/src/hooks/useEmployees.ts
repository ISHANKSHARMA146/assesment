import { useState, useCallback } from 'react';
import api from '../services/api';
import { Employee, EmployeeCreate, ApiError } from '../types';

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/v1/employees');
      setEmployees(response.data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createEmployee = useCallback(async (data: EmployeeCreate): Promise<Employee | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/v1/employees', data);
      const newEmployee = response.data;
      setEmployees((prev) => [...prev, newEmployee]);
      return newEmployee;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteEmployee = useCallback(async (id: number): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/api/v1/employees/${id}`);
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchEmployees = useCallback(async (query: string): Promise<Employee[]> => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (query.trim()) {
        params.append('search', query.trim());
      }
      const response = await api.get(`/api/v1/employees?${params.toString()}`);
      return response.data;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    employees,
    loading,
    error,
    fetchEmployees,
    createEmployee,
    deleteEmployee,
    searchEmployees,
  };
}
