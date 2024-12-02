import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  memo,
} from "react";
import ListCategoryImages from "../../components/ListImages/ListCategoryImages";
import axios from "axios";
import { ArrowLeftSquareFill, PencilFill } from "react-bootstrap-icons";
import { ImagesContext } from "../../customHooks/ImagesContext";
import { useNavigate } from "react-router";
import PropTypes from "prop-types";
import { DrawerBottom } from "../../components/imageDetails/DrawerBottom";

const CategoryView = memo(({ categorySelected: initialCategorySelected }) => {
  const { library } = useContext(ImagesContext);
  const [images, setImages] = useState([]);
  const [categorySelected, setCategorySelected] = useState(
    initialCategorySelected
  );
  const navigate = useNavigate();

  const [openBottom, setOpenBottom] = useState(false);
  const openDrawerBottom = () => setOpenBottom(true);
  const closeDrawerBottom = () => setOpenBottom(false);

  const goBack = () => {
    navigate(-1);
  };

  const getCategoryData = useCallback(
    (category) => {
      const categoryData = library[category];
      if (!categoryData || categoryData.length === 0) {
        return null;
      }
      return categoryData;
    },
    [library]
  );

  const fetchImages = useCallback(async () => {
    const data = getCategoryData(categorySelected);
    if (!data) {
      setImages([]);
      return;
    }

    const response = await Promise.all(
      data.map(async (image) => {
        const res = await axios.get(
          `https://api.unsplash.com/photos/${image.id}?client_id=${process.env.REACT_APP_ACCESS_KEY}`
        );
        return res.data;
      })
    );

    setImages(response);
  }, [categorySelected, getCategoryData]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages, categorySelected, library]);

  const editCategory = () => {
    openDrawerBottom();
  };

  const handleCategoryUpdate = (newCategoryName) => {
    setCategorySelected(newCategoryName);
  };

  if (!images) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="container mx-auto py-8">
        <div className="ms-2 flex mb-5">
          <ArrowLeftSquareFill
            className="back-button cursor-pointer"
            onClick={() => goBack()}
            width={40}
            height={40}
          />
          <div className="w-full flex justify-between">
            <h3 className="ms-6 self-center">{categorySelected}</h3>
            {categorySelected !== "saved" ? (
              <div
                className="flex gap-2 cursor-pointer self-center"
                onClick={() => editCategory()}
              >
                <PencilFill />
                <p>Editar</p>
              </div>
            ) : null}
          </div>
        </div>

        <ListCategoryImages images={images} />
      </div>

      <DrawerBottom
        openBottom={openBottom}
        closeDrawerBottom={closeDrawerBottom}
        categorySelected={categorySelected}
        onCategoryUpdate={handleCategoryUpdate} // Pass the callback to DrawerBottom
      />
    </>
  );
});

CategoryView.displayName = "CategoryView";
CategoryView.propTypes = {
  categorySelected: PropTypes.string.isRequired,
};

export default CategoryView;
