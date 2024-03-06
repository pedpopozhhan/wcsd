import { GoAAppHeader, GoACircularProgress } from '@abgov/react-components';
import { Link, Outlet } from 'react-router-dom';
import styles from './App.module.scss';
import Toast from '@/common/toast';
import { useEffect } from 'react';
import { useConditionalAuth } from './hooks';

const { mainContainer, outletContainer } = styles;

export function App() {
  const headerTitle = 'Wildfire Support';
  const auth = useConditionalAuth();

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
