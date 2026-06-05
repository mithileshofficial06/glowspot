'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Info, AlertTriangle } from 'lucide-react';

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    {
      success: (msg) => addToast(msg, 'success'),
      info: (msg) => addToast(msg, 'info'),
      error: (msg) => addToast(msg, 'error'),
    },
    [addToast]
  );

  // Memoize the value but use a ref-like pattern since toast methods are stable via useCallback
  const contextValue = { toast, addToast, removeToast };

  const icons = {
    success: <CheckCircle className="w-4 h-4" />,
    info: <Info className="w-4 h-4" />,
    error: <AlertTriangle className="w-4 h-4" />,
  };

  const colors = {
    success: 'border-gold/30 bg-[#0e0c0e] text-gold',
    info: 'border-ivory/20 bg-[#0e0c0e] text-ivory',
    error: 'border-mauve/30 bg-[#0e0c0e] text-mauve',
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-20 right-4 z-[70] flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 80, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 border backdrop-blur-sm shadow-lg ${colors[t.type]}`}
            >
              <span className="shrink-0">{icons[t.type]}</span>
              <p className="text-sm font-light flex-1">{t.message}</p>
              <button
                onClick={() => removeToast(t.id)}
                className="shrink-0 opacity-40 hover:opacity-100 transition-opacity"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}
