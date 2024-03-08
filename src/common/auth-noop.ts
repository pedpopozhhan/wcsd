/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
class AuthNoop {
  isLoading = false;
  isAuthenticated = true;
  user?: any;
  clearStaleState() {}
  signinRedirect() {}
  signoutSilent(param: any) {}
}

const authNoop = new AuthNoop();
export default authNoop;
[];
