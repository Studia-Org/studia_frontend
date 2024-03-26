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
  await fetch(`${API}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${BEARER} ${token}`,
    },
  }
  ).then((response) => {
    if (response.status !== 200) {
      removeToken();
    }
  }).catch((error) => {
    console.error(error);
  });
  return token ? true : false;
}