const envKC: KeycloakEnv = {
  dev: {
    realm: 'e8a54e8b-ca4a-404a-9ba1-00b593cd3ff8',
    authServerUrl: 'https://access.adsp-dev.gov.ab.ca/auth',
  },
  uat: {
    realm: '1405810f-b8a8-4eb6-b22a-e9e89347420b',
    authServerUrl: 'https://access-uat.alberta.ca/auth',
  },
  prod: {
    realm: '1405810f-b8a8-4eb6-b22a-e9e89347420b',
    authServerUrl: 'https://access-uat.alberta.ca/auth',
  },
};

interface KeycloakEnv {
  dev: KCInfo;
  uat: KCInfo;
  prod: KCInfo;
}

interface KCInfo {
  realm: string;
  authServerUrl: string;
}

const appEnv = import.meta.env.VITE_ENV as keyof KeycloakEnv;

// "finance" client-id is for backend
// "finance-app" is for front end,  currently it has no roles (permissions)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const oidcConfig: any = {
  authority: `${envKC[appEnv].authServerUrl}/realms/${envKC[appEnv].realm}`,
  client_id: 'finance-app',
  redirect_uri: window.location.href,
  pkce_method: 'S256',
  extraQueryParams: {
    kc_idp_hint: 'oidc',
  },
};
