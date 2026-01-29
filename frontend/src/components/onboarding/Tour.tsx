import { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';

interface TourProps {
  steps: Step[];
  run: boolean;
  onComplete: () => void;
  onNavigate?: (page: string) => void;
}

export default function Tour({ steps, run, onComplete, onNavigate }: TourProps) {
  const [isRunning, setIsRunning] = useState(run);

  useEffect(() => {
    setIsRunning(run);
  }, [run]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type, step } = data;
    
    if (type === 'step:before' && step?.target) {
      const target = step.target as string;
      
      if (target.includes('nav-employees')) {
        onNavigate?.('employees');
      } else if (target.includes('nav-attendance')) {
        onNavigate?.('attendance');
      } else if (target.includes('nav-dashboard')) {
        onNavigate?.('dashboard');
      } else if (target.includes('employee-list')) {
        onNavigate?.('employees');
      } else if (target.includes('attendance-form') || target.includes('attendance-history')) {
        onNavigate?.('attendance');
      }
    }
    
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setIsRunning(false);
      onComplete();
    }
  };

  return (
    <Joyride
      steps={steps}
      run={isRunning}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#3b82f6',
          zIndex: 10000,
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        spotlight: {
          borderRadius: 8,
        },
      }}
      locale={{
        back: 'Back',
        close: 'Close',
        last: 'Finish',
        next: 'Next',
        open: 'Open the dialog',
        skip: 'Skip Tour',
      }}
    />
  );
}
