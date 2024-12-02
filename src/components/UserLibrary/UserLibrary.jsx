import React, { useContext, memo } from "react";
import { useNavigate } from "react-router-dom";
import { ImagesContext } from "../../customHooks/ImagesContext";
import LibraryList from "./LibraryList";
import { Loading } from "../Loading";
import PropTypes from "prop-types";
import { PlusCircleFill } from "react-bootstrap-icons";

const UserLibrary = memo(({ showCategory, openDrawerBottom }) => {
  const { library, l_loading } = useContext(ImagesContext);

  const navigate = useNavigate();

  const displayLibrary = (category) => () => {
    navigate(`/library?category=${category}`);
  };

  const handleCreateLibrary = () => {
    openDrawerBottom();
  };

  if (l_loading) {
    return <Loading />;
  }

  if (!library) {
    return <div>Loading...</div>;
  }

  const otherLibraries = Object.entries(library)
    .filter(([key]) => key !== "saved")
    .map(([category, images]) => ({ category, images }));

  const savedLibraries = Object.entries(library)
    .filter(([key]) => key === "saved")
    .map(([category, images]) => ({ category, images }));
  return (
    <>
      {showCategory === "saved" ? (
        <LibraryList
          libraries={savedLibraries}
          displayLibrary={displayLibrary}
          emptyMessage="No saved images"
        />
      ) : (
        <>
          <LibraryList
            libraries={otherLibraries}
            displayLibrary={displayLibrary}
            emptyMessage="No libraries created yet"
            showCreateButton
            onCreateLibrary={handleCreateLibrary}
          />
          <div className="flex justify-center">
            <PlusCircleFill
              width={40}
              height={40}
              className="mt-24 text-red-900 hover:text-red-700 hover:scale-110 transition-transform duration-300"
              alt="Add new library"
              onClick={handleCreateLibrary}
            />
          </div>
        </>
      )}
    </>
  );
});

UserLibrary.displayName = "UserLibrary";
UserLibrary.propTypes = {
  showCategory: PropTypes.string,
  openDrawerBottom: PropTypes.func,
};

export default UserLibrary;
