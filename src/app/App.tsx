import { GoAAppHeader, GoACircularProgress } from '@abgov/react-components';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import styles from './App.module.scss';
import Toast from '@/common/toast';
import { useEffect } from 'react';
import { useConditionalAuth } from './hooks';
import { NAVIGATE_EVENT } from '@/common/navigate';

const { mainContainer, outletContainer } = styles;
export function App() {
  const headerTitle = 'Wildfire Finance';
  const auth = useConditionalAuth();
  const navigate = useNavigate();

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
  }, [auth]);

  return (
    <>
      {!auth.isLoading && (
        <div className={mainContainer}>
          <GoAAppHeader url='/' heading={headerTitle} maxContentWidth='100%'>
            <Link to='logged-out'>Log out</Link>
          </GoAAppHeader>

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
