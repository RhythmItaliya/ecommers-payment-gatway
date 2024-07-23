import React, { useContext, useEffect, useState } from "react";
import { SidebarContext } from "../contexts/SidebarContext";
import { CartContext } from "../contexts/CartContext";
import { AuthContext } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import Logo from "../img/logo.svg";
import { BsBag } from "react-icons/bs";
import Login from "../auth/Login";
import Register from "../auth/Register";
import Logout from "../auth/Logout";

const Header = () => {
  const [isActive, setIsActive] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const { isOpen, setIsOpen } = useContext(SidebarContext);
  const { itemAmount } = useContext(CartContext);
  const { isLoggedIn, loading } = useContext(AuthContext);

  const handleLoginClick = () => setIsLoginModalOpen(true);

  const handleRegisterClick = () => setIsRegisterModalOpen(true);

  const handleCloseLoginModal = () => setIsLoginModalOpen(false);

  const handleCloseRegisterModal = () => setIsRegisterModalOpen(false);

  const handleCartClick = () => {
    if (isLoggedIn) {
      setIsOpen(!isOpen);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsActive(window.scrollY > 60);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) {
    return;
  }

  return (
    <header
      className={`${isActive ? "bg-white py-4 shadow-md" : "bg-none py-6"} fixed w-full z-10 lg:px-8 transition-all`}
    >
      <div className="container mx-auto flex items-center justify-between h-full">
        <Link to="/">
          <div className="w-[40px]">
            <img src={Logo} alt="Logo" />
          </div>
        </Link>

        {/* cart */}
        <div onClick={handleCartClick} className="cursor-pointer flex relative gap-5">
          <BsBag className="text-2xl" />
          {itemAmount > 0 && (
            <div className="bg-red-500 absolute -right-2 -bottom-2 text-[12px] w-[18px] h-[18px] text-white rounded-full flex justify-center items-center">
              {itemAmount}
            </div>
          )}
        </div>

        {/* login/register */}
        <div className="flex items-center space-x-4">
          {!isLoggedIn ? (
            <>
              <button onClick={handleLoginClick} className="btn">
                Login
              </button>
              <button onClick={handleRegisterClick} className="btn">
                Register
              </button>
            </>
          ) : (
            <Logout />
          )}
        </div>
      </div>
      {isLoginModalOpen && <Login isOpen={isLoginModalOpen} onClose={handleCloseLoginModal} onRegisterClick={handleRegisterClick} />}
      {isRegisterModalOpen && <Register isOpen={isRegisterModalOpen} onClose={handleCloseRegisterModal} onLoginClick={handleLoginClick} />}
    </header>
  );
};

export default Header;
