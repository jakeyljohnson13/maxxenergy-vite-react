// src/auth.js
const TOKEN_KEY = "token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new Event("auth-changed"));
};

export const onAuthChange = (cb) => {
  const handler = () => cb(Boolean(getToken()));
  window.addEventListener("auth-changed", handler);

  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("auth-changed", handler);
    window.removeEventListener("storage", handler);
  };
};
