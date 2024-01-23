import React, { useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { message } from "antd";
import { API, BEARER } from "../constant";
import { useEffect } from "react";
import { getToken } from "../helpers";
import { fetchLogUserLogging } from "../fetches/fetchLogUserLogging";

const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const authToken = getToken()


  const fetchLoggedInUser = async (token) => {
    try {
      const response = await fetch(`${API}/users/me?populate=*`, {
        headers: { Authorization: `${BEARER} ${token}` },
      });
      const data = await response.json();

      setUserData(data);
      fetchLogUserLogging({ data, token })



    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUser = (user) => {
    setUserData(user);
  };

  useEffect(() => {
    if (authToken) {
      fetchLoggedInUser(authToken);
    }
  }, [authToken]);

  return (
    <AuthContext.Provider
      value={{ user: userData, setUser: handleUser, isLoading, setIsLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;