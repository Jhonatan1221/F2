import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  memo,
} from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Avatar,
  IconButton,
} from "@material-tailwind/react";

import { UserContext } from "../../customHooks/UserContext";
import { ImagesContext } from "../../customHooks/ImagesContext";
import { useNavigate } from "react-router";
import axios from "axios";
import PropTypes from "prop-types";
import { CustomSelect } from "./CustomSelect";
import { useNetworkCheck } from "../../customHooks/network-context";

const ImageDetails = memo(({ handleOpen, open, srcImage, image }) => {
  const { user } = useContext(UserContext);
  const { library, setRefresh } = useContext(ImagesContext);
  const [isFavorite, setIsFavorite] = useState(false);
  const librariesNames = library
    ? Object.keys(library).filter((category) => category !== "saved")
    : [];

  const navigate = useNavigate();
  const { isOnline } = useNetworkCheck();

  const createLibrary = async () => {
    navigate("/profile");
  };

  //check is image is favorite
  useEffect(() => {
    const checkSavedStatus = async () => {
      const url = `${process.env.REACT_APP_BACK_API}/users/${user._id}/isFavorite/${image.id}`;
      axios
        .get(url)
        .then((response) => {
          if (response.status === 200) {
            let isFavorite = false;
            response.data.filter((item) => {
              if (item.category === "saved") {
                isFavorite = true;
              }
            });
            setIsFavorite(isFavorite);
          }
        })
        .catch((error) => {
          console.error("Error checking saved status: ", error);
        });
    };
    if (image) {
      checkSavedStatus();
    }
  }, [user, image]);

  //toggle save image
  const toggleSave = useCallback(async () => {
    try {
      if (!user || !image || !srcImage) return;

      await axios
        .post(
          process.env.REACT_APP_BACK_API + "/users/" + user._id + "/toggleSave",
          {
            category: "saved",
            id: image.id,
            url: srcImage,
            user_id: user._id,
          }
        )
        .then((response) => {
          if (response.status === 200) {
            if (response.data.message === "removed") {
              setIsFavorite(false);
            } else {
              setIsFavorite(true);
            }
          } else {
            console.error("Error saving image: ", response);
          }
        })
        .catch((error) => {
          console.error("Error saving image: ", error);
        });

      setRefresh((e) => !e);
    } catch (error) {
      console.error("Error toggling save:", error);
    }
  }, [user, image, srcImage, setRefresh]);

  return (
    <>
      <Dialog
        size="sm"
        open={open}
        handler={handleOpen}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
        className="min-w-52"
      >
        <DialogHeader className="justify-between md:sm flex-col md:flex-row">
          <div className="flex items-center gap-3">
            <Avatar
              size="sm"
              variant="circular"
              alt={image?.user}
              src={image?.user?.profile_image.small}
            />
            <div className="-mt-px flex flex-col">
              <p color="blue-gray" className="font-medium">
                {image?.user?.first_name}
              </p>
              <p color="gray" className="text-xs font-normal">
                {image?.user?.username}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:sm flex-col md:flex-row">
            {isOnline ? (
              <>
                <IconButton
                  variant="text"
                  size="sm"
                  color={isFavorite ? "red" : "blue-gray"}
                  onClick={toggleSave}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                  </svg>
                </IconButton>
                {librariesNames.length > 0 ? (
                  <CustomSelect
                    categories={librariesNames}
                    image={image}
                    srcImage={srcImage}
                    library={library}
                    user={user}
                  />
                ) : (
                  <p className="text-sm">
                    You have no libraries.
                    <button onClick={createLibrary} className="text-blue-500">
                      Create one now
                    </button>
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm">
                You are offline, you cant save images now!
              </p>
            )}
          </div>
        </DialogHeader>
        <DialogBody>
          <img
            alt={image?.alt_description}
            className="rounded-lg object-contain object-center max-h-96 w-full "
            src={srcImage}
          />
        </DialogBody>
        <DialogFooter className="justify-between">
          <p>
            {image?.alt_description ? image?.alt_description : "No description"}
          </p>
          <div className="flex items-center gap-16">
            <div>
              <p color="gray" className="font-bold ">
                Views
              </p>
              <p color="blue-gray" className="font-medium">
                {image?.views ? image?.views : 1}
              </p>
            </div>
            <div>
              <p color="gray" className="font-bold">
                Likes
              </p>
              <p color="blue-gray" className="font-medium">
                {image?.likes ? image?.likes : 0}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outlined"
            color="blue-gray"
            className="mr-5 flex items-center"
          >
            Share
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
});

ImageDetails.displayName = "ImageDetails";
ImageDetails.propTypes = {
  handleOpen: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  srcImage: PropTypes.string.isRequired,
  image: PropTypes.object.isRequired,
};
export default ImageDetails;
