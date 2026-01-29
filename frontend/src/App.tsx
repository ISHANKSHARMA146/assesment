import { useState, useEffect } from 'react';
import Dashboard from './components/dashboard/Dashboard';
import EmployeeList from './components/employees/EmployeeList';
import AttendanceManagement from './components/attendance/AttendanceManagement';
import Tour from './components/onboarding/Tour';
import WelcomeOverlay from './components/onboarding/WelcomeOverlay';
import { tourSteps } from './utils/tourSteps';
import api from './services/api';

type Page = 'dashboard' | 'employees' | 'attendance';

const TOUR_STORAGE_KEY = 'hrms-lite-tour-completed';
const KEEP_ALIVE_INTERVAL_MS = 40_000;

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [showWelcomeOverlay, setShowWelcomeOverlay] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [tourKey, setTourKey] = useState(0);

  useEffect(() => {
    const tourCompleted = localStorage.getItem(TOUR_STORAGE_KEY);
    if (!tourCompleted) {
      setShowWelcomeOverlay(true);
    }
  }, []);

  const handleStartTour = () => {
    setShowWelcomeOverlay(false);
    setCurrentPage('dashboard');
    setTourKey((k) => k + 1);
    setTimeout(() => setShowTour(true), 400);
  };

  useEffect(() => {
    const ping = () => api.get('/health').catch(() => {});
    const id = setInterval(ping, KEEP_ALIVE_INTERVAL_MS);
    ping();
    return () => clearInterval(id);
  }, []);

  const handleTourComplete = () => {
    localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    setShowTour(false);
  };

  const handleRestartTour = () => {
    setCurrentPage('dashboard');
    setTourKey((k) => k + 1);
    setTimeout(() => setShowTour(true), 300);
  };

  const handleTourNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);

  const handleOpenEmployeeModal = () => {
    setEmployeeModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-blue rounded flex items-center justify-center">
                <div className="grid grid-cols-2 gap-0.5 p-1">
                  <div className="w-1.5 h-1.5 bg-white rounded-sm"></div>
                  <div className="w-1.5 h-1.5 bg-white rounded-sm"></div>
                  <div className="w-1.5 h-1.5 bg-white rounded-sm"></div>
                  <div className="w-1.5 h-1.5 bg-white rounded-sm"></div>
                </div>
              </div>
              <span className="text-xl font-semibold text-text-primary">HRMS Lite</span>
              <span className="px-2 py-1 text-xs font-medium bg-primary-blue-light text-primary-blue rounded">
                Admin View
              </span>
            </div>
            <div className="flex items-center gap-6">
              <button
                onClick={() => setCurrentPage('dashboard')}
                data-tour="nav-dashboard"
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  currentPage === 'dashboard'
                    ? 'text-primary-blue border-b-2 border-primary-blue'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentPage('employees')}
                data-tour="nav-employees"
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  currentPage === 'employees'
                    ? 'text-primary-blue border-b-2 border-primary-blue'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Employees
              </button>
              <button
                onClick={() => setCurrentPage('attendance')}
                data-tour="nav-attendance"
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  currentPage === 'attendance'
                    ? 'text-primary-blue border-b-2 border-primary-blue'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Attendance
              </button>
              <button
                onClick={handleRestartTour}
                className="px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-primary-blue transition-colors flex items-center gap-1.5 border-l border-border pl-6"
                title="Restart onboarding tour"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Tour</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Home</span>
            <span>/</span>
            <span className="text-text-primary capitalize">{currentPage}</span>
          </div>
        </div>
      </div>

      <main>
        {currentPage === 'dashboard' && (
          <Dashboard
            onNavigate={(page) => setCurrentPage(page)}
            onOpenEmployeeModal={handleOpenEmployeeModal}
          />
        )}
        {currentPage === 'employees' && (
          <EmployeeList
            isModalOpen={employeeModalOpen}
            onModalClose={() => setEmployeeModalOpen(false)}
          />
        )}
        {currentPage === 'attendance' && <AttendanceManagement />}
      </main>

      {showWelcomeOverlay && <WelcomeOverlay onStartTour={handleStartTour} />}
      <Tour
        key={tourKey}
        steps={tourSteps}
        run={showTour}
        onComplete={handleTourComplete}
        onNavigate={handleTourNavigate}
      />
    </div>
  );
}
