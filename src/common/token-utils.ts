export const parseToken = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

export const hasResourceRole = (resource: string, permission: string, token: string): boolean => {
  const tokenObj = parseToken(token);
  const resourceAccess = tokenObj?.resource_access;
  if (!resourceAccess) return false;
  const roles = resourceAccess[resource || '']?.roles || [];
  return roles.indexOf(permission) !== -1;
};
