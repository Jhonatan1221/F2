import React, { useContext, useEffect } from "react";
import { Navbar, Collapse, IconButton } from "@material-tailwind/react";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "../../customHooks/UserContext";
import Logo from "../../assets/logos/logo40.svg";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

function CustomNavbar({ children }) {
  const { user, logout } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };
  const [openNav, setOpenNav] = React.useState(false);

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  const navList = (
    <ul className="flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6 w-full py-">
      {user && (
        <>
          <Link
            to="/profile"
            className="nav-link-custom self-center items-center"
          >
            <img
              src={user?.photoURL || "../../assets/user-default-120.webp"}
              alt="foto de perfil"
              width="50"
              height="50"
              className={`rounded-full cursor-pointer align-center ${
                isActive("/profile") ? "ring-4 ring-deep-orange-900" : ""
              }`}
            />
          </Link>
        </>
      )}

      <Link
        to="/"
        className={`p-1 font-normal items-center cursor-pointer text-black text-center  ${
          isActive("/") ? "bg-deep-orange-900 text-white rounded px-4" : ""
        }`}
      >
        Home
      </Link>
      {!user ? (
        <Link
          to="/login"
          className={`p-1 font-normal items-center cursor-pointer text-black text-center w-full ${
            isActive("/login")
              ? "bg-deep-orange-900 text-white rounded px-4"
              : ""
          }`}
        >
          Log In
        </Link>
      ) : (
        <Link
          onClick={handleLogout}
          className={`p-1 font-normal items-center cursor-pointer text-black  text-center ${
            isActive("/login") ? "bg-blue-gray-900 text-white rounded px-4" : ""
          }`}
        >
          Logout
        </Link>
      )}
    </ul>
  );

  return (
    <div>
      <Navbar className="sticky top-0 z-10 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4">
        <div className="flex items-center justify-between text-blue-gray-900 mx-14">
          <div className="mr-4 cursor-pointer py-1.5 font-medium flex items-center gap-2">
            <Link to="/">
              {" "}
              <img src={Logo} alt="Logo" width="40" height="40" />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden lg:block">{navList}</div>

            <IconButton
              variant="text"
              className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
              ripple={false}
              onClick={() => setOpenNav(!openNav)}
            >
              {openNav ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </IconButton>
          </div>
        </div>

        <Collapse
          open={openNav}
          className="flex justify-center flex-col items-center w-full"
        >
          {navList}
        </Collapse>
      </Navbar>
      <div className="p-8">{children}</div>
    </div>
  );
}

CustomNavbar.propTypes = {
  children: PropTypes.node,
};

export default CustomNavbar;
