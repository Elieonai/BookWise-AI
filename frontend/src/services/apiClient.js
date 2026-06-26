const apiBaseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '/api';

export const buildApiUrl = (path) => `${apiBaseUrl}${path}`;