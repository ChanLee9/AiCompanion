import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { MessageCircle, Clock, Brain, User } from 'lucide-react';
import { useAppStore } from '../store';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'motion/react';

const navItems = [
  { path: '/', label: '聊天', icon: MessageCircle },
  { path: '/sessions', label: '会话', icon: Clock },
  { path: '/memory', label: '记忆', icon: Brain },
  { path: '/profile', label: '我的', icon: User },
];

export const Layout = () => {
  const { isOnboarded } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isOnboarded && location.pathname !== '/onboarding') {
      navigate('/onboarding', { replace: true });
    } else if (isOnboarded && location.pathname === '/onboarding') {
      navigate('/', { replace: true });
    }
  }, [isOnboarded, location.pathname, navigate]);

  if (!isOnboarded && location.pathname !== '/onboarding') {
    return null;
  }

  const isHideNav = location.pathname === '/onboarding';

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center text-neutral-800 font-sans">
      <div className="w-full max-w-md h-[100dvh] bg-white sm:rounded-3xl sm:h-[800px] sm:shadow-2xl overflow-hidden relative flex flex-col">
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto relative bg-neutral-50/50 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Navigation */}
        {!isHideNav && (
          <nav className="h-16 bg-white border-t border-neutral-200 flex items-center justify-around px-2 shrink-0 flex-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={clsx(
                    "flex flex-col items-center justify-center w-16 h-full space-y-1 transition-colors relative",
                    isActive ? "text-indigo-600" : "text-neutral-400 hover:text-neutral-600"
                  )}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-[2px] bg-indigo-600 rounded-b-full"
                    />
                  )}
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </div>
  );
};
