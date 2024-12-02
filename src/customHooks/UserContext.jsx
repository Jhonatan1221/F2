import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import PropTypes from "prop-types";
const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userLocalStorage, setUserLocalStorage] = useState(null);

  const [userRefresh, setUserRefresh] = useState(false);
  const [userCategories, setUserCategories] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = JSON.parse(localStorage.getItem("authState")) || null;
      setUserLocalStorage(storedUser);
    }
  }, []);

  const getUserFromMongo = useCallback(() => {
    if (!userLocalStorage) {
      console.log("No userLocalStorage found, skipping API call.");
      return null;
    }
    console.log("Fetching user from API:", userLocalStorage._id);

    axios
      .get(process.env.REACT_APP_BACK_API + "/users/" + userLocalStorage._id)
      .then((res) => {
        if (res.status === 200) {
          console.log("User fetched from API:", res.data);

          setUser(res.data);
          setUserCategories(res.data.categories);
          localStorage.setItem("authState", JSON.stringify(res.data));
        } else {
          console.log("API response not 200:", res.status);
          return null;
        }
      })
      .catch((error) => {
        console.error("Error getting user: ", error);
      });
  }, [userLocalStorage]);

  //HANDLE LOGIN or SIGNUP
  useEffect(() => {
    getUserFromMongo();
  }, [userRefresh, getUserFromMongo]);

  const logout = () => {
    localStorage.removeItem("authState");
    setUser(null);
  };

  useEffect(() => {
    console.log("UserContext initialized with user:", user);
    console.log("UserLocalStorage:", userLocalStorage);
  }, [user, userLocalStorage]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        userLocalStorage,
        setUserLocalStorage,
        userRefresh,
        setUserRefresh,
        logout,
        userCategories,
        setUserCategories,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export { UserContext, UserProvider };
