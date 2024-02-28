const apiKeyCode = import.meta.env.VITE_API_KEY_CODE;
export default function getHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'x-functions-key': apiKeyCode,
    'X-CSRF': '1',
    Authorization: `Bearer ${token}`,
    // Accept: "application/json",
    // "Content-Type": "application/json",
    // "X-CSRF": "1",
    // Authorization: `Bearer ${token}`, // <== access token from auth
  };
}
