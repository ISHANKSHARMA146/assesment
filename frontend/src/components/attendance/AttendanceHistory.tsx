import { useState, useEffect } from 'react';
import { Employee, Attendance } from '../../types';
import AttendanceTable from './AttendanceTable';
import LoadingSpinner from '../common/LoadingSpinner';
import SearchInput from '../common/SearchInput';
import DateInput from '../common/DateInput';
import MultiSelect from '../common/MultiSelect';
import { getDatePresets } from '../../utils/datePresets';
import { DEPARTMENT_OPTIONS } from '../../utils/constants';

interface AttendanceHistoryProps {
  attendance: Attendance[];
  employees: Employee[];
  loading: boolean;
  onFilterChange: (filters: { employee_id?: number; from_date?: string; to_date?: string; departments?: string[] }) => void;
}

export default function AttendanceHistory({
  attendance,
  employees,
  loading,
  onFilterChange,
}: AttendanceHistoryProps) {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

  useEffect(() => {
    const newFilters = {
      employee_id: selectedEmployee?.id,
      from_date: fromDate || undefined,
      to_date: toDate || undefined,
      departments: selectedDepartments.length > 0 ? selectedDepartments : undefined,
    };
    onFilterChange(newFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEmployee?.id, fromDate, toDate, selectedDepartments]);

  return (
    <div className="card">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-text-primary mb-1">Attendance History</h3>
        <p className="text-sm text-text-secondary">Recent logs and employee status</p>
      </div>

      <div className="mb-4 space-y-3">
        <div>
          <SearchInput
            employees={employees}
            onSelect={setSelectedEmployee}
            placeholder="Search employee by name, ID, or email..."
            showAllOption={true}
          />
        </div>
        <div>
          <MultiSelect
            label="Filter by Department"
            options={DEPARTMENT_OPTIONS as unknown as string[]}
            selected={selectedDepartments}
            onChange={setSelectedDepartments}
            placeholder="Select departments..."
          />
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {getDatePresets().map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                setFromDate(preset.fromDate);
                setToDate(preset.toDate);
              }}
              className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-text-primary rounded-lg hover:bg-gray-200 transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <DateInput
              label="From Date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              max={toDate || new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="flex-1">
            <DateInput
              label="To Date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              min={fromDate || undefined}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <AttendanceTable attendance={attendance} employees={employees} />
      )}
    </div>
  );
}
