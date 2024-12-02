import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const useFetchRandomImages = () => {
  const [randomImages, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRandomImages = useCallback(async (page = 1) => {
    try {
      const total = 40;
      const response = await axios.get(
        // `https://api.unsplash.com/photos/random?count=${count}&client_id=${process.env.ACCESS_KEY}`
        `https://api.unsplash.com/photos?page=${page}&per_page=${total}&client_id=${process.env.REACT_APP_ACCESS_KEY}`
      );
      setImages(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  }, []);

  useEffect(() => {
    if (randomImages.length === 0) {
      fetchRandomImages();
    }
  }, [fetchRandomImages, randomImages]);

  return { randomImages, loading };
};

export default useFetchRandomImages;
