import { useEffect, useState } from 'react';
import { useEmployees } from '../../hooks/useEmployees';
import EmployeeTable from './EmployeeTable';
import EmployeeForm from './EmployeeForm';
import Modal from '../common/Modal';
import LoadingSpinner from '../common/LoadingSpinner';
import Toast from '../common/Toast';
import Button from '../common/Button';
import ConfirmDialog from '../common/ConfirmDialog';
import { EmployeeCreate, ApiError } from '../../types';

interface EmployeeListProps {
  isModalOpen?: boolean;
  onModalClose?: () => void;
}

export default function EmployeeList({ isModalOpen: externalModalOpen, onModalClose }: EmployeeListProps = {}) {
  const { employees, loading, fetchEmployees, createEmployee, deleteEmployee, searchEmployees } = useEmployees();
  const [internalModalOpen, setInternalModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | undefined>();
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; messages?: string[]; type: 'success' | 'error' } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [displayedEmployees, setDisplayedEmployees] = useState(employees);
  const [isSearching, setIsSearching] = useState(false);

  const isModalOpen = externalModalOpen !== undefined ? externalModalOpen : internalModalOpen;

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    setDisplayedEmployees(employees);
  }, [employees]);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (searchQuery.trim()) {
        setIsSearching(true);
        try {
          const results = await searchEmployees(searchQuery);
          setDisplayedEmployees(results);
        } catch (error) {
          setDisplayedEmployees([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setDisplayedEmployees(employees);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchQuery, employees, searchEmployees]);

  useEffect(() => {
    if (externalModalOpen !== undefined && externalModalOpen) {
      setInternalModalOpen(true);
    }
  }, [externalModalOpen]);

  const handleCreateEmployee = async (data: EmployeeCreate) => {
    try {
      await createEmployee(data);
      setInternalModalOpen(false);
      if (onModalClose) {
        onModalClose();
      }
      setToast({ message: 'Employee added successfully', type: 'success' });
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

  const handleDeleteClick = (id: number) => {
    setConfirmDeleteId(id);
  };

  const handleDeleteConfirm = async () => {
    if (confirmDeleteId === null) return;
    const id = confirmDeleteId;
    setConfirmDeleteId(null);
    setDeletingId(id);
    try {
      await deleteEmployee(id);
      setToast({ message: 'Employee deleted successfully', type: 'success' });
    } catch (err) {
      const apiError = err as ApiError;
      setToast({ 
        message: apiError.message, 
        messages: apiError.messages,
        type: 'error' 
      });
    } finally {
      setDeletingId(undefined);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Employee Directory</h1>
        <p className="text-text-secondary">Manage your team members and their account permissions here.</p>
      </div>

      <div className="card mb-6" data-tour="employee-list">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1 max-w-md mx-auto relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, ID, or email..."
              className="w-full px-4 py-2 pl-10 pr-10 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {isSearching ? (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-primary-blue border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                title="Clear search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ) : null}
          </div>
          <Button
            variant="primary"
            onClick={() => {
              setInternalModalOpen(true);
            }}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Add Employee
          </Button>
        </div>

        {loading && displayedEmployees.length === 0 && !searchQuery ? (
          <LoadingSpinner />
        ) : (
          <EmployeeTable
            employees={displayedEmployees}
            onDelete={handleDeleteClick}
            deletingId={deletingId}
            isSearchResult={!!searchQuery.trim()}
          />
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          if (onModalClose) {
            onModalClose();
          } else {
            setInternalModalOpen(false);
          }
        }}
        title="Add New Employee"
      >
        <EmployeeForm
          onSubmit={handleCreateEmployee}
          onCancel={() => {
            setInternalModalOpen(false);
            if (onModalClose) {
              onModalClose();
            }
          }}
          loading={loading}
        />
      </Modal>

      {toast && (
        <Toast
          message={toast.message}
          messages={toast.messages}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <ConfirmDialog
        isOpen={confirmDeleteId !== null}
        title="Delete Employee"
        message={`Are you sure you want to delete this employee? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDeleteId(null)}
        variant="danger"
      />
    </div>
  );
}
