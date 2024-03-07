/* eslint-disable indent */
const url: string = import.meta.env.VITE_AUTHORIZATION_AUTHSERVERURL;
const realm: string = import.meta.env.VITE_AUTHORIZATION_REALM;
// "finance" client-id is for backend
// "finance-app" is for front end,  currently it has no roles (permissions)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const oidcConfig: any = {
  authority: `${url}/realms/${realm}`,
  client_id: 'finance-app',
  redirect_uri: window.location.href,
  pkce_method: 'S256',
  extraQueryParams: {
    kc_idp_hint: 'oidc',
  },
};
