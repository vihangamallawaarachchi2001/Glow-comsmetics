import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion"; 
import logoicon1 from '../assets/logo.png';
import searchicon from "../assets/icons/search_icon.png";
import usericon from "../assets/icons/user_icon.png";
import carticon from "../assets/icons/carticon.png";
import { FaBars, FaTimes } from "react-icons/fa"; 

const Navbar = () => {
  const [isLogged, setIsLogged] = useState(false);
  const [signup, setSignup] = useState(false);
  const [login, setLogin] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false); 
  const [isUserDropdownOpen, setUserDropdownOpen] = useState(false); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogged(!!token);
  }, []);

  const toggleSignup = () => {
    setSignup((prev) => !prev);
    setUserDropdownOpen(false); 
  };

  const toggleLogin = () => {
    setLogin((prev) => !prev);
    setUserDropdownOpen(false); 
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen((prev) => !prev); 
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev); 
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLogged(false);
    location.reload();
  };

  return (
    <div className="flex items-center justify-between sm:px-10 font-medium text-gray-700 font-['Outfit']">
      {/* Logo */}
      <motion.img
        src={logoicon1}
        className="mt-2 w-28 cursor-pointer"
        alt="Logo"
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300 }}
      />

      {/* Navbar Links */}
      <ul className="hidden sm:flex gap-10 md:gap-10 text-sm font-medium">
        {[
          { to: "/", text: "Home" },
          { to: "/newarrivals", text: "New Arrivals" },
          { to: "/products", text: "Collections" },
          { to: "/reviews", text: "Reviews" },
          { to: "/about", text: "About Us" },
          { to: "/contactus", text: "Contact Us" },
          { to: "/faqs", text: "FAQs" },
        ].map((item, index) => (
          <motion.li key={index} whileHover={{ scale: 1.1, y: -5 }}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 hover:text-blue-500 ${
                  isActive ? "text-blue-600" : ""
                }`
              }
            >
              <p>{item.text}</p>
              <motion.hr
                className="w-2/4 border-none h-[1.5px] bg-blue-500 hidden"
                layoutId="underline"
              />
            </NavLink>
          </motion.li>
        ))}
      </ul>

      <div className="sm:hidden flex items-center">
        <motion.button
          onClick={toggleMobileMenu}
          whileHover={{ scale: 1.2 }}
          transition={{ duration: 0.3 }}
        >
          {isMobileMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
        </motion.button>
      </div>

      {/* Icons */}
      <div className="flex items-center gap-6">
        <motion.img
          src={searchicon}
          className="w-5 cursor-pointer"
          alt="Search"
          whileHover={{ scale: 1.2 }}
          transition={{ duration: 0.3 }}
        />

        <div className="relative">
          <motion.img
            src={usericon}
            className="w-5 cursor-pointer"
            alt="User"
            onClick={toggleUserDropdown} 
            whileHover={{ scale: 1.2 }}
          />
          {isUserDropdownOpen && (
            <motion.div
              className="absolute right-0 mt-2 bg-slate-100 rounded shadow-lg p-4 z-10"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex flex-col gap-2 w-36 py-3 px-5">
                {!isLogged ? (
                  <div>
                    <Link to="/signup">
                      <p className="cursor-pointer hover:text-black" onClick={toggleSignup}>Signup</p>
                    </Link>

                    <Link to="/login">
                    <p className="cursor-pointer hover:text-black" onClick={toggleLogin}>Login</p>
                    </Link>
                  </div>
                ) : (
                  <div>
                    <Link to="profile">
                      <p className="cursor-pointer hover:text-black">My Profile</p>
                    </Link>
                    <Link to="/order/pendingOrder">
                      <p className="cursor-pointer hover:text-black">My Orders</p>
                    </Link>
                    <p className="cursor-pointer hover:text-black" onClick={logout}>Logout</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        <Link to="/cart" className="relative">
          <motion.img
            src={carticon}
            className="w-6 cursor-pointer"
            alt="Cart"
            whileHover={{ scale: 1.2 }}
          />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
