import { GoAAppHeader, GoACircularProgress, GoAIcon, GoAPopover } from '@abgov/react-components';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import styles from './App.module.scss';
import Toast from '@/common/toast';
import { useEffect, useState } from 'react';
import { useConditionalAuth } from './hooks';
import { NAVIGATE_EVENT } from '@/common/navigate';

const { mainContainer, outletContainer, account } = styles;
export function App() {
  const headerTitle = 'Wildfire Finance';
  const logoUrl = import.meta.env.VITE_WILDFIRE_PORTAL_URL;
  const auth = useConditionalAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const processNavigateToEvent: EventListener = (event: Event) => {
    const customEvent = event as CustomEvent;
    if (customEvent) {
      navigate(customEvent.detail);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    document.addEventListener(NAVIGATE_EVENT, processNavigateToEvent);

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      document.removeEventListener(NAVIGATE_EVENT, processNavigateToEvent);
    };
  }, []);

  useEffect(() => {
    const isLoggedOutPath = window.location.pathname === 'logged-out';

    if (!isLoggedOutPath && !auth.isLoading && !auth.isAuthenticated) {
      if (window.location.search) {
        window.location.href = window.location.origin;
      } else {
        auth.clearStaleState();
        auth.signinRedirect();
      }
    }
    if (auth.isAuthenticated && auth.user) {
      setEmail(auth.user.profile.email);
    }
  }, [auth]);

  const target = (
    <div className={account}>
      <GoAIcon type='person-circle'></GoAIcon>
      <span>{email}</span>
      <GoAIcon type='chevron-down'></GoAIcon>
    </div>
  );
  return (
    <>
      {!auth.isLoading && (
        <div className={mainContainer}>
          {email && (
            <GoAAppHeader url={logoUrl} heading={headerTitle} maxContentWidth='100%'>
              <GoAPopover target={target}>
                <Link to='logged-out'>Sign out</Link>
              </GoAPopover>
            </GoAAppHeader>
          )}
          {!email && <GoAAppHeader url={logoUrl} heading={headerTitle} maxContentWidth='100%'></GoAAppHeader>}

          <div className={outletContainer}>
            <Outlet />
          </div>
          <Toast></Toast>
        </div>
      )}
      {auth.isLoading && <GoACircularProgress visible={true} />}
    </>
  );
}

export default App;
