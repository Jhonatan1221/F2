import React, {
  useContext,
  createContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import PropTypes from "prop-types";

const NetworkContext = createContext(null);

export const NetworkProvider = ({ children }) => {
  const [isOnline, setOnline] = useState(() => {
    return navigator.onLine;
  });
  const setOnlineToTrue = useCallback(() => {
    setOnline(true);
  }, []);
  const setOnlineToFalse = useCallback(() => {
    setOnline(false);
  }, []);

  useEffect(() => {
    window.addEventListener("online", setOnlineToTrue);
    window.addEventListener("offline", setOnlineToFalse);
    return () => {
      window.removeEventListener("online", setOnlineToTrue);
      window.removeEventListener("offline", setOnlineToFalse);
    };
  }, [setOnlineToTrue, setOnlineToFalse]);

  return (
    <NetworkContext.Provider value={{ isOnline }}>
      {children}
    </NetworkContext.Provider>
  );
};

NetworkProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export const useNetworkCheck = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw Error("useNetworkCheck must be inside of NetworkProvider");
  }
  return context;
};
