import { useState, useEffect, useRef } from 'react';
import { Employee } from '../../types';
import Avatar from './Avatar';

interface SearchInputProps {
  employees: Employee[];
  onSelect: (employee: Employee | null) => void;
  placeholder?: string;
  showAllOption?: boolean;
  disabled?: boolean;
}

export default function SearchInput({
  employees,
  onSelect,
  placeholder = 'Search employees...',
  showAllOption = true,
  disabled = false,
}: SearchInputProps) {
  const [query, setQuery] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim() === '') {
      setFilteredEmployees(employees);
    } else {
      const lowerQuery = query.toLowerCase();
      const filtered = employees.filter(
        (emp) =>
          emp.full_name.toLowerCase().includes(lowerQuery) ||
          emp.employee_id.toLowerCase().includes(lowerQuery) ||
          emp.email.toLowerCase().includes(lowerQuery)
      );
      setFilteredEmployees(filtered);
    }
    setSelectedIndex(-1);
  }, [query, employees]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (employee: Employee | null) => {
    onSelect(employee);
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    const options = showAllOption
      ? [null, ...filteredEmployees]
      : filteredEmployees;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < options.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < options.length) {
        handleSelect(options[selectedIndex] as Employee | null);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-yellow-200 font-semibold">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const displayOptions = showAllOption
    ? [null, ...filteredEmployees]
    : filteredEmployees;

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-4 py-2 pl-10 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
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
      </div>

      {isOpen && displayOptions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {showAllOption && (
            <button
              type="button"
              onClick={() => handleSelect(null)}
              className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                selectedIndex === 0 ? 'bg-gray-100' : ''
              }`}
            >
              <span className="text-sm font-medium text-text-primary">
                All Employees
              </span>
            </button>
          )}
          {filteredEmployees.map((emp, idx) => {
            const optionIndex = showAllOption ? idx + 1 : idx;
            return (
              <button
                key={emp.id}
                type="button"
                onClick={() => handleSelect(emp)}
                className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                  selectedIndex === optionIndex ? 'bg-gray-100' : ''
                }`}
              >
                <Avatar name={emp.full_name} size={32} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {highlightText(emp.full_name, query)}
                  </p>
                  <p className="text-xs text-text-secondary truncate">
                    {emp.employee_id} • {emp.email}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {isOpen && query.trim() !== '' && filteredEmployees.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-border rounded-lg shadow-lg p-4 text-center text-sm text-text-secondary">
          No employees found
        </div>
      )}
    </div>
  );
}
