// client/src/api/auth.js
const API = import.meta.env.VITE_API_URL;

export async function register(email, password) {
  const res = await fetch(`${API}/api/auth/register`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ email, password })
  });
  if(!res.ok) throw new Error(await res.text());
  return res.json(); // { token, email }
}

export async function login(email, password) {
  const res = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ email, password })
  });
  if(!res.ok) throw new Error(await res.text());
  return res.json(); // { token, email }
}

export function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}
