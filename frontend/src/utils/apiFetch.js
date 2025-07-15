export const apiFetch = async (url, options = {}) => {
  const defaultHeaders = {
    'ngrok-skip-browser-warning': 'true',
    ...options.headers,
  };

  const config = {
    ...options,
    headers: defaultHeaders,
  };

  return fetch(url, config);
}; 