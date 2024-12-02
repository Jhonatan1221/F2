import React, { lazy, Suspense, useContext } from "react";
import { ImagesContext } from "../../customHooks/ImagesContext";

const InfiniteList = lazy(() =>
  import("../../components/ListImages/InfiniteList")
);

const Home = () => {
  const { storedImages, s_loading, setStoredImages, page, setPage } =
    useContext(ImagesContext);

  return s_loading ? (
    <p>Loading images...</p>
  ) : (
    <Suspense fallback={<div>Loading...</div>}>
      <InfiniteList
        images={storedImages}
        setImages={setStoredImages}
        page={page}
        setPage={setPage}
      />
    </Suspense>
  );
};

export default Home;
