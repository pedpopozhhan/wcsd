/* eslint-disable indent */
const url: string = import.meta.env.VITE_AUTHORIZATION_AUTHSERVERURL;
const realm: string = import.meta.env.VITE_AUTHORIZATION_REALM;
// "finance" client-id is for backend
// "finance-app" is for front end,  currently it has no roles (permissions)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const oidcConfig: any = import.meta.env.VITE_ENABLE_AUTHORIZATION
  ? {
      authority: `${url}/realms/${realm}`,
      client_id: 'finance-app',
      redirect_uri: window.location.href,
      pkce_method: 'S256',
      extraQueryParams: {
        kc_idp_hint: 'oidc',
      },
    }
  : {
      authority: '', // No authority
      client_id: '', // No client ID
      redirect_uri: window.location.origin, // Redirect to the same origin
      response_type: 'id_token token', // Response type
      scope: 'openid profile', // Basic scopes
      silent_redirect_uri: window.location.origin, // Same origin for silent redirect
      automaticSilentRenew: false,
    };
