import { createContext, useContext } from 'react';
import type { ToastMessage } from '../../types';

export interface ToastContextType {
  showToast: (type: ToastMessage['type'], message: string, duration?: number) => void;
}

export const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}
