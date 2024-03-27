import { API, AUTH_TOKEN, BEARER } from "./constant";

export const getToken = () => {
  return localStorage.getItem(AUTH_TOKEN);
};

export const setToken = (token) => {
  if (token) {
    localStorage.setItem(AUTH_TOKEN, token);
  }
};

export const removeToken = () => {
  localStorage.removeItem(AUTH_TOKEN);
};

export const checkAuthenticated = async () => {
  const token = getToken();
  const response = await fetch(`${API}/users/me`, {
    headers: {
      Authorization: `${BEARER} ${token}`,
    },
  });
  const data = await response.json();
  if (data?.error) {
    removeToken();
    return false;
  }
  return true;
}