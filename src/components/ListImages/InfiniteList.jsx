import React, {
  useState,
  useContext,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import ImageDetails from "../imageDetails/ImageDetails";
import { toast } from "react-toastify";
import { UserContext } from "../../customHooks/UserContext";
import InfiniteScroll from "react-infinite-scroll-component";
import { Card } from "@material-tailwind/react";
import axios from "axios";
import { Loading } from "../Loading";
import { optimizeImageUrl } from "../../utils";
import { useNetworkCheck } from "../../customHooks/network-context";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const InfiniteList = () => {
  const { user } = useContext(UserContext);
  const [imageData, setImageData] = useState(null);
  const [srcImage, setSrcImage] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [nextImages, setNextImages] = useState([]);
  const { isOnline } = useNetworkCheck();
  const key = process.env.REACT_APP_ACCESS_KEY;

  const fetchImages = useCallback(
    async (page = 1) => {
      try {
        const total = 30;
        const response = await axios.get(
          `https://api.unsplash.com/photos?page=${page}&per_page=${total}&client_id=${key}`
        );
        setData(response.data);
        setPage(page + 1);
        return response.data;
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    },
    [key]
  );

  const getImages = useCallback(() => {
    if (!data) return;
    const response = [...data.map((image) => image)];
    setNextImages(response);
  }, [data]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  useMemo(() => {
    getImages();
  }, [getImages]);

  const handleUnregisteredUsers = () => {
    if (!user) {
      toast.error("You must log in to perform this action.");
      return false;
    }
    return true;
  };

  const handleOpen = async (image, url) => {
    if (!handleUnregisteredUsers()) return;
    setSrcImage(url);
    setImageData(image);
    setOpen((cur) => !cur);
  };

  const fetchMoreImages = async () => {
    const newImages = await fetchImages(page);
    const response = [...data, ...newImages];
    setData(response);
  };

  if (!nextImages || nextImages.length === 0) {
    return <Loading />;
  }

  const renderImages = () => {
    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-11 place-items-center">
        {nextImages.map((image, index) => (
          <Card
            key={index}
            className="cursor-pointer transition-opacity hover:opacity-90"
            style={{ height: 400, width: 200 }}
            onClick={() =>
              handleOpen(image, optimizeImageUrl(image.urls?.thumb))
            }
          >
            <LazyLoadImage
              // effect="blur"
              rel="preload"
              srcSet={optimizeImageUrl(image.urls?.thumb)}
              src={optimizeImageUrl(image.urls?.thumb)}
              alt={image.alt_description || "Image from Unsplash"}
              className="object-fill transform hover:scale-105 transition-transform duration-300 rounded-md"
              height={400}
              width={200}
            />
          </Card>
        ))}
      </div>
    );
  };

  return (
    <>
      {imageData ? (
        <ImageDetails
          handleOpen={handleOpen}
          open={open}
          image={imageData}
          srcImage={srcImage}
        />
      ) : (
        <></>
      )}
      <InfiniteScroll
        dataLength={nextImages ? nextImages.length : 0}
        next={() => {
          fetchMoreImages();
        }}
        hasMore={isOnline}
        loader={<Loading />}
        scrollThreshold={0.8}
        endMessage={
          <p className="py-10 text-xl justify-center text-center">
            <b>
              {!isOnline ? "check your internet connection" : "No more images"}
            </b>
          </p>
        }
      >
        {renderImages()}
      </InfiniteScroll>{" "}
    </>
  );
};

export default InfiniteList;
