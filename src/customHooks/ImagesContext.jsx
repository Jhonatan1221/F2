import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import useFetchRandomImages from "./useFetchRandomImages";
import { UserContext } from "./UserContext";
import axios from "axios";
import PropTypes from "prop-types";

export const ImagesContext = createContext();

export const ImagesProvider = ({ children }) => {
  const { userCategories } = useContext(UserContext);

  const { randomImages, loading: s_loading } = useFetchRandomImages();
  const [storedImages, setStoredImages] = useState([]);
  const { user } = useContext(UserContext);
  const [library, setLibrary] = useState(userCategories || []);
  const [l_loading, setL_loading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (randomImages.length > 0 && storedImages.length === 0) {
      setStoredImages(randomImages);
    }
  }, [randomImages, storedImages]);

  const fetchAndSetLibrary = useCallback(async () => {
    const url = `${process.env.REACT_APP_BACK_API}/users/${user._id}/categories`;
    axios
      .get(url)
      .then((res) => {
        if (res.status === 200) {
          setLibrary(res.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching library: ", error);
      })
      .finally(() => {
        setRefresh(false);
      });
  }, [user]);

  useEffect(() => {
    if (refresh) {
      fetchAndSetLibrary();
    }
  }, [refresh, fetchAndSetLibrary]);

  useEffect(() => {
    setLibrary(userCategories);
  }, [userCategories]);

  return (
    <ImagesContext.Provider
      value={{
        setStoredImages,
        storedImages,
        s_loading,
        library,
        setLibrary,
        l_loading,
        setL_loading,
        setRefresh,
        page,
        setPage,
      }}
    >
      {children}
    </ImagesContext.Provider>
  );
};

ImagesProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
