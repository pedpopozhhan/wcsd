import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import { useAuth } from 'react-oidc-context';
import authNoop from '@/common/auth-noop';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
// thanks https://redux-toolkit.js.org/tutorials/typescript
export const useAppDispatch: () => AppDispatch = useDispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function useConditionalAuth() {
  const auth = useAuth();
  const isAuthEnabled = import.meta.env.VITE_ENABLE_AUTHORIZATION === 'true';
  if (isAuthEnabled) {
    return auth;
  }
  return authNoop;
}
