interface WelcomeOverlayProps {
  onStartTour: () => void;
}

export default function WelcomeOverlay({ onStartTour }: WelcomeOverlayProps) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm"
      aria-modal
      role="dialog"
    >
      <div className="mx-4 w-full max-w-md rounded-xl bg-white p-8 shadow-xl">
        <div className="mb-6 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-blue">
            <div className="grid grid-cols-2 gap-0.5 p-1.5">
              <div className="h-2 w-2 rounded-sm bg-white" />
              <div className="h-2 w-2 rounded-sm bg-white" />
              <div className="h-2 w-2 rounded-sm bg-white" />
              <div className="h-2 w-2 rounded-sm bg-white" />
            </div>
          </div>
        </div>
        <h1 className="mb-2 text-center text-2xl font-bold text-text-primary">Welcome to HRMS Lite</h1>
        <p className="mb-6 text-center text-text-secondary">
          Manage employees and track daily attendance. Take a quick tour to see the main features.
        </p>
        <button
          type="button"
          onClick={onStartTour}
          className="w-full rounded-lg bg-primary-blue px-4 py-3 font-medium text-white transition-colors hover:bg-blue-600"
        >
          Start tour
        </button>
      </div>
    </div>
  );
}
