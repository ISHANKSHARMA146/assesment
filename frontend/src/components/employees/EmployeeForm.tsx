import { useState, FormEvent } from 'react';
import { EmployeeCreate } from '../../types';
import Input from '../common/Input';
import Button from '../common/Button';
import Select from '../common/Select';
import { VALIDATION_CONSTANTS, DEPARTMENT_OPTIONS } from '../../utils/constants';

interface EmployeeFormProps {
  onSubmit: (data: EmployeeCreate) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function EmployeeForm({ onSubmit, onCancel, loading }: EmployeeFormProps) {
  const [formData, setFormData] = useState<EmployeeCreate>({
    employee_id: '',
    full_name: '',
    email: '',
    department: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof EmployeeCreate, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof EmployeeCreate, string>> = {};

    if (!formData.employee_id.trim()) {
      newErrors.employee_id = 'Employee ID is required';
    } else if (
      formData.employee_id.length < VALIDATION_CONSTANTS.EMPLOYEE_ID.MIN_LENGTH || 
      formData.employee_id.length > VALIDATION_CONSTANTS.EMPLOYEE_ID.MAX_LENGTH
    ) {
      newErrors.employee_id = `Employee ID must be ${VALIDATION_CONSTANTS.EMPLOYEE_ID.MIN_LENGTH}-${VALIDATION_CONSTANTS.EMPLOYEE_ID.MAX_LENGTH} characters`;
    }

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    } else if (
      formData.full_name.length < VALIDATION_CONSTANTS.FULL_NAME.MIN_LENGTH || 
      formData.full_name.length > VALIDATION_CONSTANTS.FULL_NAME.MAX_LENGTH
    ) {
      newErrors.full_name = `Full name must be ${VALIDATION_CONSTANTS.FULL_NAME.MIN_LENGTH}-${VALIDATION_CONSTANTS.FULL_NAME.MAX_LENGTH} characters`;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    } else if (!(DEPARTMENT_OPTIONS as readonly string[]).includes(formData.department)) {
      newErrors.department = 'Please select a valid department';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        await onSubmit(formData);
        setFormData({ employee_id: '', full_name: '', email: '', department: '' });
        setErrors({});
      } catch (error) {
        const apiError = error as { message?: string };
        if (apiError.message) {
          setErrors({ employee_id: apiError.message });
        }
        throw error;
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Employee ID"
        value={formData.employee_id}
        onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
        error={errors.employee_id}
        placeholder="e.g., EMP-001"
        disabled={loading}
      />
      <Input
        label="Full Name"
        value={formData.full_name}
        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
        error={errors.full_name}
        placeholder="e.g., John Doe"
        disabled={loading}
      />
      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        error={errors.email}
        placeholder="e.g., john.doe@company.com"
        disabled={loading}
      />
      <Select
        label="Department"
        value={formData.department}
        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
        error={errors.department}
        disabled={loading}
        options={DEPARTMENT_OPTIONS.map((dept) => ({ value: dept, label: dept }))}
      />
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          disabled={loading}
          className="flex-1"
        >
          Add Employee
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
