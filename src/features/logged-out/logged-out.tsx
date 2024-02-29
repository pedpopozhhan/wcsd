import { GoAButton } from '@abgov/react-components';
import { useAuth } from 'react-oidc-context';
import { useEffect } from 'react';
import authNoop from '@/common/auth-noop';

export const LoggedOut = () => {
  const auth = import.meta.env.VITE_ENABLE_AUTHORIZATION ? useAuth() : authNoop;
  useEffect(() => {
    if (!auth.isLoading && auth.isAuthenticated) {
      auth.signoutSilent({ id_token_hint: auth.user?.id_token });
    }
  }, [auth]);

  return (
    <>
      <div className='content'>
        <h1>Logged Out</h1>
        <p>You have successfully logged out from the Wildfire Contracts Portal</p>
        <GoAButton onClick={() => (window.location.href = window.location.origin)}>Login</GoAButton>
      </div>
    </>
  );
};
