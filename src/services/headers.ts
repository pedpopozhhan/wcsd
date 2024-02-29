const apiKeyCode = import.meta.env.VITE_API_KEY_CODE;
const authEnabled = import.meta.env.VITE_ENABLE_AUTHORIZATION;
export default function getHeaders(token: string) {
  const authToken = authEnabled ? token : 'noop_token';

  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'x-functions-key': apiKeyCode,
    'X-CSRF': '1',
    Authorization: `Bearer ${authToken}`,
  };
}
