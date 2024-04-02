import React, { useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { API, BEARER } from "../constant";
import { useEffect } from "react";
import { getToken } from "../helpers";
import { fetchLogUserLogging } from "../fetches/fetchLogUserLogging";
import { useNavigate } from "react-router-dom";

const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const authToken = getToken()
  const navigate = useNavigate()

  const fetchLoggedInUser = async (token) => {
    try {
      const response = await fetch(`${API}/users/me?populate=*`, {
        headers: { Authorization: `${BEARER} ${token}` },
      });
      const data = await response.json();
      if (window.location.pathname === '/') {
        navigate('/app/courses')
      }
      setAuthenticated(true);
      setUserData(data);
      fetchLogUserLogging({ data, token })

    } catch (error) {
      setAuthenticated(false);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };



  const handleUser = (user) => {
    // setUserData(user);
  };

  useEffect(() => {
    if (authToken) {
      fetchLoggedInUser(authToken);
    } else {
      setAuthenticated(false);
      setIsLoading(false)
    }
  }, [authToken]);

  return (
    <AuthContext.Provider
      value={{ user: userData, setUser: handleUser, isLoading, setIsLoading, authenticated: authenticated, setAuthenticated: setAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;