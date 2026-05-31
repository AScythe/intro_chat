// App.tsx
// Description: Root component — React Router setup with SocketContext, UserContext, progress stepper, and toast system

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Toaster } from 'sonner';
import { Sun, Moon } from 'lucide-react';
import { SocketProvider } from '@/context/SocketContext';
import { UserProvider } from '@/context/UserContext';
import { ThemeProvider, useTheme } from '@/context/useTheme';
import { Button } from '@/components/ui/button';
import { HomePage } from '@/pages/HomePage';
import { UserInfoPage } from '@/pages/UserInfoPage';
import { RoomPage } from '@/pages/RoomPage';
import { ChatPage } from '@/pages/ChatPage';
import { PeoplePage } from '@/pages/PeoplePage';
import { ConnectPage } from '@/pages/ConnectPage';

const STEPS = [
  { label: 'Join', path: '/' },
  { label: 'Profile', path: '/join' },
  { label: 'Room', path: '/room' },
  { label: 'People', path: '/people' },
  { label: 'Chat', path: '/chat' },
  { label: 'Connect', path: '/connect' },
];

function getCurrentStep(pathname: string): number {
  if (pathname === '/') return 0;
  if (pathname.startsWith('/join')) return 1;
  if (pathname.startsWith('/room')) return 2;
  if (pathname.startsWith('/people')) return 3;
  if (pathname.startsWith('/chat')) return 4;
  if (pathname.startsWith('/connect')) return 5;
  return 0;
}

function ProgressStepper() {
  const location = useLocation();
  const currentStep = getCurrentStep(location.pathname);

  return (
    <div className="mx-auto flex w-full max-w-app items-center justify-center gap-1 px-4 pt-6 pb-2">
      {STEPS.map((step, i) => {
        const isActive = i === currentStep;
        const isPast = i < currentStep;
        return (
          <div key={step.label} className="flex items-center gap-1">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium transition-colors duration-300 ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : isPast
                    ? 'bg-primary/30 text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
              }`}
            >
              {isPast ? '✓' : i + 1}
            </div>
            <span
              className={`hidden text-xs font-medium sm:inline ${
                isActive
                  ? 'text-foreground'
                  : isPast
                    ? 'text-muted-foreground'
                    : 'text-muted-foreground/60'
              }`}
            >
              {step.label}
            </span>
            {i < STEPS.length - 1 && (
              <div
                className={`mx-1 h-px w-6 transition-colors duration-300 ${
                  isPast ? 'bg-primary/40' : 'bg-border'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
};

const pageTransition = {
  duration: 0.4,
  ease: 'easeOut' as const,
};

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/join/:eventId" element={<UserInfoPage />} />
          <Route path="/room/:eventId" element={<RoomPage />} />
          <Route path="/people/:eventId" element={<PeoplePage />} />
          <Route path="/chat/:matchId" element={<ChatPage />} />
          <Route path="/connect/:matchId" element={<ConnectPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="fixed bottom-4 left-4 z-50 rounded-full"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </Button>
  );
}

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <SocketProvider>
          <BrowserRouter>
            <ProgressStepper />
            <AnimatedRoutes />
            <ThemeToggle />
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: 'hsl(var(--card))',
                  color: 'hsl(var(--card-foreground))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                },
              }}
            />
          </BrowserRouter>
        </SocketProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
