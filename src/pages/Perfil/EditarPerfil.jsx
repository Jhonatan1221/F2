import React, { useState } from "react";
import {
  Button,
  Dialog,
  Card,
  CardBody,
  CardFooter,
  Input,
} from "@material-tailwind/react";
import { toast } from "react-toastify";
import axios from "axios";
import PropTypes from "prop-types";

const EditarPerfil = ({ open, setOpen, user, setUser }) => {
  const [newDisplayName, setNewDisplayName] = useState("");

  const handleSubmit = async () => {
    if (newDisplayName === "") {
      toast.error("Username cannot be empty");
      setOpen((cur) => !cur);
      return;
    }

    const url = `${process.env.REACT_APP_BACK_API}/users/${user._id}`;
    axios
      .put(url, {
        displayName: newDisplayName,
        id: user._id,
      })
      .then((res) => {
        if (res.status === 200) {
          setUser({ ...user, displayName: newDisplayName });
          toast.success("Username updated successfully");
        } else {
          console.error("Error updating display name in database:", res);
          toast.error("Error updating display name. Try later");
        }
      })
      .catch((error) => {
        toast.error("Error updating display name. Try later");
        console.error("Error updating display name in database:", error);
      });

    setOpen((cur) => !cur);
  };
  const handleChange = (e) => {
    setNewDisplayName(e.target.value);
  };

  return (
    <Dialog
      size="xs"
      open={open}
      handler={() => setOpen((cur) => !cur)}
      className="bg-transparent shadow-none"
    >
      <Card className="mx-auto w-full max-w-[24rem]">
        <CardBody className="flex flex-col gap-4">
          <p color="blue-gray">Update profile</p>
          <p className="mb-3 font-normal" color="gray">
            Edit Username
          </p>
          <Input
            label="Username"
            size="lg"
            value={newDisplayName}
            onChange={handleChange}
          />
        </CardBody>
        <CardFooter className="pt-0">
          <Button variant="gradient" onClick={handleSubmit} fullWidth>
            Change
          </Button>
        </CardFooter>
      </Card>
    </Dialog>
  );
};

EditarPerfil.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  setUser: PropTypes.func.isRequired,
};

export default EditarPerfil;
