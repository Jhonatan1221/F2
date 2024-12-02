import React from "react";
import "./Loading.css";
export const Loading = () => {
  return (
    <div className="container-loading">
      <div className="spinner"></div>
      <span>Loading more images...</span>
    </div>
  );
};
