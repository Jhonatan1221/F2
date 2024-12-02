import React, { useContext, useEffect, useState } from "react";
import { Option, Select } from "@material-tailwind/react";
import axios from "axios";
import { ImagesContext } from "../../customHooks/ImagesContext";
import PropTypes from "prop-types";

export const CustomSelect = ({
  image,
  srcImage,
  categories,
  library,
  user,
}) => {
  const { setRefresh: setRefreshLibrary } = useContext(ImagesContext);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {}, [refresh]);

  //add image to library
  const handleAddToLibrary = async (categorySelected) => {
    const url = `${process.env.REACT_APP_BACK_API}/users/${user._id}/categories`;
    const data = {};
    data[categorySelected] = [
      {
        id: image.id,
        url: srcImage,
      },
    ];

    axios
      .post(url, {
        category: data,
      })
      .then((res) => {
        if (res.status === 200) {
          setRefreshLibrary(true);
          if (res.data.imageAlreadySaved) {
            console.log("removed in library");
          } else {
            console.log("added to library");
          }
          setRefresh((e) => !e);
        } else {
          console.error("Error adding to library: ", res);
        }
      })
      .catch((error) => {
        console.error("Error adding to library: ", error);
      });
  };

  const existsInLibrary = (category, id) => {
    const categoryData = library[category];
    const exists = categoryData.find((image) => image.id === id);
    return exists;
  };

  if (!categories) {
    return null;
  }

  return (
    <Select
      label="Add to library"
      onChange={(library) => handleAddToLibrary(library)}
    >
      {categories.map((library) => (
        <Option
          key={library}
          value={library}
          className={`${
            existsInLibrary(library, image?.id)
              ? "!bg-deep-orange-900 !text-white hover:!bg-deep-orange-900 hover:!text-white "
              : ""
          }`}
        >
          {library}
        </Option>
      ))}
    </Select>
  );
};

CustomSelect.displayName = "CustomSelect";
CustomSelect.propTypes = {
  image: PropTypes.object,
  srcImage: PropTypes.string,
  categories: PropTypes.array,
  library: PropTypes.object,
  user: PropTypes.object,
};
