import { useEffect } from 'react';

interface ToastProps {
  message: string;
  messages?: string[];
  type: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, messages, type, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = type === 'success' ? 'bg-status-present' : 'bg-status-absent';
  const displayMessages = messages && messages.length > 0 ? messages : [message];

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg min-w-[300px] max-w-[500px]`}>
        <div className="flex items-start justify-between mb-2">
          <span className="font-semibold">{displayMessages.length > 1 ? 'Errors:' : message}</span>
          <button
            onClick={onClose}
            className="ml-4 text-white hover:text-gray-200 transition-colors flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {displayMessages.length > 1 && (
          <ul className="list-disc list-inside space-y-1 text-sm">
            {displayMessages.map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
