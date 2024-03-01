import { GoAButton } from '@abgov/react-components';
import { useEffect } from 'react';
import { useConditionalAuth } from '@/app/hooks';

export const LoggedOut = () => {
  const auth = useConditionalAuth();
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
