import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import { PERMISSION } from '@/common/permission';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
// thanks https://redux-toolkit.js.org/tutorials/typescript
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
// export a hook for checking permissions
export const useCheckPermission = (permission: PERMISSION) => {
  const userPermissions = useSelector((state: RootState) => state.auth.user?.permissions);
  return userPermissions && userPermissions.includes(permission);
};
