import styles from './toast.module.scss';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/app/hooks';
import { GoAIcon } from '@abgov/react-components';

let { container, label } = styles;
interface IProps {}
const Toast: React.FC<IProps> = (props) => {
  const toast = useAppSelector((state) => state.app.toast);

  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    setIsVisible(true);
    console.log(toast.type);
    setTimeout(() => {
      setIsVisible(false);
    }, 5000);
  }, [toast]);

  return !isVisible ? null : (
    <div className={`${container} ${styles[toast.type]}`}>
      {toast.type === 'success' && <GoAIcon type='checkmark-circle' theme='outline' size='large'></GoAIcon>}
      {toast.type === 'error' && <GoAIcon type='close-circle' theme='outline' size='large'></GoAIcon>}
      {toast.type === 'info' && <GoAIcon type='information-circle' theme='outline' size='large'></GoAIcon>}
      {toast.type === 'warning' && <GoAIcon type='warning' theme='outline' size='large'></GoAIcon>}
      <div className={label}>{toast.message}</div>
      {toast.callback && <a onClick={toast.callback()}></a>}
    </div>
  );
};

export default Toast;
