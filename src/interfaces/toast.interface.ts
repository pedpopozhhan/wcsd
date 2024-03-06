import { Action } from 'redux';

export interface IToast {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  callback?: () => void;
  action?: Action;
}
