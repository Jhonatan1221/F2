import React, { lazy, Suspense, useCallback, useEffect, useState } from "react";
import {
  useRoutes,
  BrowserRouter,
  Navigate,
  useSearchParams,
} from "react-router-dom";
import CustomNavbar from "./components/navbar/CustomNavbar";
import { UserProvider } from "./customHooks/UserContext";
import { ImagesProvider } from "./customHooks/ImagesContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { NetworkProvider } from "./customHooks/network-context";
import OfflineFallback from "./OfflineFallback";

import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";

const Home = lazy(() => import("./pages/Home/Home"));
const Perfil = lazy(() => import("./pages/Perfil/Perfi"));
const Login = lazy(() => import("./pages/Login/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const CategoryView = lazy(() => import("./pages/CategoryView/CategoryView"));

const AppRoutes = React.memo(() => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");

  const user = JSON.parse(localStorage.getItem("authState"));

  return useRoutes([
    {
      path: "/profile",
      element: user ? <Perfil /> : <Navigate to="/login" replace={true} />,
    },
    {
      path: "/library",
      element:
        user && category ? (
          <CategoryView categorySelected={category} />
        ) : (
          <Navigate to="/login" replace={true} />
        ),
    },
    {
      path: "/login",
      element: user ? <Navigate to="/" replace={true} /> : <Login />,
    },
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/offline",
      element: <OfflineFallback />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);
});

AppRoutes.displayName = "AppRoutes";
const App = () => {
  const [token, setToken] = useState(null);
  const getTokenNotification = async () => {
    const registration = await navigator.serviceWorker.ready;

    const response = await getToken(messaging, {
      serviceWorkerRegistration: registration,
      vapidKey: process.env.REACT_APP_PUSH_NOTIFICATION_KEY,
    }).catch((err) => console.error("Error getting token: ", err));

    if (response) {
      setToken(response);
    } else {
      console.log("No token");
    }
  };
  const notifyme = useCallback(() => {
    if (!window.Notification) {
      console.log("This browser does not support notifications.");
      return;
    }
    if (Notification.permission === "granted") {
      getTokenNotification();
    } else if (
      Notification.permission !== "denied" ||
      Notification.permission === "default"
    ) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("permission granted");
          getTokenNotification();
        }
      });
    }
  }, []);

  useEffect(() => {
    notifyme();
    console.log("token: ", token);
  }, [notifyme, token]);

  return (
    <BrowserRouter basename={"/"}>
      <NetworkProvider>
        <UserProvider>
          <ImagesProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <ToastContainer />
              <CustomNavbar>
                <AppRoutes />
              </CustomNavbar>
            </Suspense>
          </ImagesProvider>
        </UserProvider>
      </NetworkProvider>
    </BrowserRouter>
  );
};

export default App;
