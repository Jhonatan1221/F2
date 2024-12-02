import React from "react";
import Empty from "../../assets/logos/empty.webp";
import PropTypes from "prop-types";
const LibraryList = ({ libraries, displayLibrary, emptyMessage }) => {
  if (libraries.length === 0) {
    return (
      <div className="mt-10">
        <div className="flex flex-col items-center justify-center">
          <p>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {Object.entries(libraries).map(([, values]) => (
            <div
              className="rounded relative h-44 cursor-pointer"
              key={values.category}
              onClick={displayLibrary(values.category)}
            >
              <h3 className="font-bold">{values.category}</h3>

              {values?.images[0]?.url ? (
                <img
                  src={values?.images[0]?.url}
                  width={200}
                  height={200}
                  alt={`${values.category}`}
                  className="rounded object-cover w-full h-full"
                />
              ) : (
                <img
                  src={Empty}
                  width={200}
                  height={200}
                  alt={`${values?.category}`}
                  className="rounded object-cover w-full h-full"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

LibraryList.propTypes = {
  libraries: PropTypes.array.isRequired,
  displayLibrary: PropTypes.func.isRequired,
  emptyMessage: PropTypes.string.isRequired,
  showCreateButton: PropTypes.bool,
  onCreateLibrary: PropTypes.func,
};

export default LibraryList;
