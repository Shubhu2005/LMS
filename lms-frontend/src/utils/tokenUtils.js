export const setTokenStorage = (token, user) => {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + 24);

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("tokenExpiry", expiry.toISOString());

  sessionStorage.setItem("token", token);
  sessionStorage.setItem("user", JSON.stringify(user));
};

export const clearStorage = () => {
  ["token", "user", "tokenExpiry"].forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
};

export const getStoredToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token") || null;

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};