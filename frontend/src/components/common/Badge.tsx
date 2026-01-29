import { STATUS_COLORS, DEPARTMENT_COLORS } from '../../utils/constants';

interface BadgeProps {
  type: 'status' | 'department';
  value: string;
  onRemove?: (e: React.MouseEvent) => void;
}

export default function Badge({ type, value, onRemove }: BadgeProps) {
  const color = type === 'status' 
    ? STATUS_COLORS[value as keyof typeof STATUS_COLORS] || '#6b7280'
    : DEPARTMENT_COLORS[value] || '#6b7280';

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${
        onRemove ? 'pr-1' : ''
      }`}
      style={{ backgroundColor: color }}
    >
      {value}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-2 hover:bg-white/20 rounded-full p-0.5 transition-colors"
          aria-label={`Remove ${value}`}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
}
