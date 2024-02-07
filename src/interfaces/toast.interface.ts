export interface IToast {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  callback?: () => any;
}

// TODO: Toast
