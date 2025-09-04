// client/src/api/me.js
import { authHeader } from "./auth";
const API = import.meta.env.VITE_API_URL;

export async function getMe() {
  const res = await fetch(`${API}/api/auth/me`, { headers: { ...authHeader() } });
  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
}
