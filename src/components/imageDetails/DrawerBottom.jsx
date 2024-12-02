import React, { useContext, useState, useEffect } from "react";
import { Drawer, IconButton, Button, Input } from "@material-tailwind/react";
import { toast } from "react-toastify";
import { UserContext } from "../../customHooks/UserContext";
import { ImagesContext } from "../../customHooks/ImagesContext";
import axios from "axios";
import PropTypes from "prop-types";
import { Trash2Fill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

export const DrawerBottom = ({
  openBottom,
  closeDrawerBottom,
  categorySelected,
  onCategoryUpdate,
}) => {
  const { user } = useContext(UserContext);
  const { setRefresh: setRefreshLibrary } = useContext(ImagesContext);
  const [newLibrary, setNewLibrary] = useState("");
  const navigate = useNavigate(); // Initialize navigate hook

  // Synchronize newLibrary with categorySelected when it changes
  useEffect(() => {
    setNewLibrary(categorySelected || "");
  }, [categorySelected]);

  const postLibrary = async () => {
    if (!newLibrary || newLibrary.trim() === "") {
      toast.error("Library name is required");
      return;
    }

    try {
      const url = `${process.env.REACT_APP_BACK_API}/users/${user._id}/categories`;

      // Check if updating an existing category or creating a new one
      if (categorySelected) {
        // Update existing category
        const response = await axios.post(url, {
          oldCategory: categorySelected,
          newCategory: newLibrary.trim(),
        });

        if (response.status === 200) {
          onCategoryUpdate(newLibrary);
          toast.success("Library updated successfully");
        }
      } else {
        // Create new category
        const data = {};
        data[newLibrary.trim()] = [];

        const response = await axios.post(url, { category: data });

        if (response.status === 200) {
          if (response.data.message.includes("updated")) {
            toast.info("Library already exists");
          } else {
            toast.success("Library created successfully");
          }
        }
      }

      setRefreshLibrary((prev) => !prev); // Trigger refresh
    } catch (error) {
      console.error("Error processing library:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      handleClose();
    }
  };

  const deleteCategory = async (category) => {
    console.log("Deleting category:", category);

    const confirmResponse = confirm("Delete " + category + "?");

    if (!confirmResponse) return;

    const url = `${process.env.REACT_APP_BACK_API}/users/${user._id}/categories`;

    try {
      const res = await axios.delete(url, {
        data: { category },
      });

      if (res.status === 200) {
        toast.success("Deleted successfully");
        console.log(res.data.message);

        setRefreshLibrary((prev) => !prev); // Trigger refresh
        navigate("/profile"); // Replace with your target route
      }
    } catch (error) {
      // Check if error has a response from the server
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error("Response error:", error.response.data);
        toast.error(`Error: ${error.response.data.message || "Unknown error"}`);
      } else if (error.request) {
        // Request was made but no response was received
        console.error("Request error:", error.request);
        toast.error("No response from the server. Please try again later.");
      } else {
        // Something happened setting up the request
        console.error("General error:", error.message);
        toast.error(`Error: ${error.message}`);
      }
    }
  };

  const handleClose = () => {
    setNewLibrary(categorySelected || ""); // Reset to categorySelected or empty string
    closeDrawerBottom();
  };

  return (
    <Drawer
      placement="bottom"
      open={openBottom}
      onClose={handleClose}
      className="p-4"
    >
      <div className="mb-6 flex items-center justify-center">
        <p>Give a name to your library</p>
        <IconButton variant="text" color="blue-gray" onClick={handleClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </IconButton>
      </div>
      <div className="flex justify-center gap-2">
        <div className="flex w-1/2 gap-2">
          <Input
            label="Library"
            onChange={(e) => setNewLibrary(e.target.value)}
            placeholder="Library"
            value={newLibrary}
          />
          <Button size="sm" onClick={postLibrary}>
            {categorySelected ? "Edit" : "Create"}
          </Button>
        </div>
        {categorySelected && (
          <Trash2Fill
            size="48px"
            color="red"
            onClick={() => deleteCategory(categorySelected)}
          />
        )}
      </div>
    </Drawer>
  );
};

DrawerBottom.propTypes = {
  openBottom: PropTypes.bool,
  closeDrawerBottom: PropTypes.func,
  categorySelected: PropTypes.string,
  onCategoryUpdate: PropTypes.func,
};
