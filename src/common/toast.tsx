import styles from './toast.module.scss';
import { useEffect, useState } from 'react';
import { GoAIcon } from '@abgov/react-components';
import { IToast } from '@/interfaces/toast.interface';
import { Action } from 'redux';
import { useAppDispatch } from '@/app/hooks';

let { container, label, spacer } = styles;
export const TOAST_EVENT = 'toast';
export const publishToast = (toast: IToast) => {
  const event = new CustomEvent(TOAST_EVENT, { detail: toast });
  document.dispatchEvent(event);
};

interface IProps {}
const Toast: React.FC<IProps> = (props) => {
  const dispatch = useAppDispatch();
  const [toast, setToast] = useState<IToast>({} as any);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  let timeout: NodeJS.Timeout;
  const processToastEvent = (event: CustomEvent) => {
    const _toast = event.detail as IToast;
    if (_toast) {
      setToast(_toast);
      setIsVisible(true);
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    }
  };

  useEffect(() => {
    document.addEventListener(TOAST_EVENT, processToastEvent as any);

    return () => {
      document.removeEventListener(TOAST_EVENT, processToastEvent as any);
    };
  }, []);

  function showRetry() {
    return toast.callback || toast.action;
  }

  function retry() {
    clearTimeout(timeout);
    setIsVisible(false);

    if (toast.callback) {
      toast.callback();
    }
    if (toast.action) {
      dispatch(toast.action);
    }
  }
  return !isVisible ? null : (
    <div className={`${container} ${styles[toast.type]}`}>
      {toast.type === 'success' && <GoAIcon type='checkmark-circle' theme='outline' size='large'></GoAIcon>}
      {toast.type === 'error' && <GoAIcon type='close-circle' theme='outline' size='large'></GoAIcon>}
      {toast.type === 'info' && <GoAIcon type='information-circle' theme='outline' size='large'></GoAIcon>}
      {toast.type === 'warning' && <GoAIcon type='warning' theme='outline' size='large'></GoAIcon>}
      <div className={label}>{toast.message}</div>
      {showRetry() && <div className={spacer}></div>}
      {showRetry() && <a onClick={retry}>Retry</a>}
    </div>
  );
};

export default Toast;
