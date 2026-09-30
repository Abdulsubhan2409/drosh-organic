export const API_URL = "http://localhost:5002";

export const getToken = () => localStorage.getItem("drosh_admin_token");
export const setToken = (t) => localStorage.setItem("drosh_admin_token", t);
export const clearToken = () => localStorage.removeItem("drosh_admin_token");
export const getTokenExpiry = () => {
  try {
    const payload = getToken().split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(payload)).exp * 1000;
  } catch {
    return 0;
  }
};

export async function api(path, options = {}) {
  const token = getToken();
  const isForm = options.body instanceof FormData;

  const res = await fetch(API_URL + path, {
    ...options,
    headers: {
      ...(isForm ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}