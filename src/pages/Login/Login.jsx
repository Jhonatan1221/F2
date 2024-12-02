import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithGooglePopup } from "../../firebase";
import googleIcon from "../../assets/logos/google40.svg";
import { useNetworkCheck } from "../../customHooks/network-context";
import axios from "axios";
import { UserContext } from "../../customHooks/UserContext";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const { isOnline } = useNetworkCheck();
  const { setUserLocalStorage, setUserRefresh, userRefresh } =
    useContext(UserContext);

  const logGoogleUser = async () => {
    if (!isOnline) {
      navigate("/offline");
      return;
    }

    try {
      const response = await signInWithGooglePopup();
      const user = response.user;

      const userData = {
        displayName: user.displayName || "",
        email: user.email || "",
        photoURL: user.photoURL || "",
        _id: user.uid,
      };
      axios
        .post(process.env.REACT_APP_BACK_API + "/users", userData)
        .then(function (response) {
          if (response.status === 201 || response.status === 200) {
            setUserRefresh(!userRefresh);
            setUserLocalStorage(userData);
            navigate("/");
          } else {
            toast.error("Error when logging in");
          }
        })
        .catch(function (error) {
          console.error("login eror: ", error);
        });

      // navigate("/");
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-[calc(100vh-200px)]">
      <div className="h-2/5 flex justify-center flex-col">
        <h2 className="text-3xl font-bold mb-4 text-center red">Login</h2>
        <button
          onClick={logGoogleUser}
          className="bg-blue-gray-100 text-black font-bold py-2 px-4 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors duration-300"
        >
          <img
            src={googleIcon}
            alt="Google icon"
            className="bg-blue-gray-200  mr-2 rounded border-amber-900 bg-gradient-to-r from-pink-500 to-purple-500 shadow-md"
            width={40}
            height={40}
          />
          Sign In With Google
        </button>
      </div>
    </div>
  );
};

export default Login;
