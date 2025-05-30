import React, { useEffect, useState, useContext } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserContext } from "../../context/userContext";
import { RiUser3Line, RiSunFill } from "react-icons/ri";

const Navbar = () => {
  useUserAuth();
  const { user } = useContext(UserContext);

  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleNavClick = (id, isMobile = false) => {
    if (location.pathname !== "/") {
      navigate("/", { replace: false });
      setTimeout(() => {
        scrollToSection(id);
      }, 100);
    } else {
      scrollToSection(id);
    }

    if (isMobile) toggleMenu();
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  const renderProfileIcon = () => {
    if (user?.profileImageUrl) {
      return (
        <img
          src={user.profileImageUrl}
          alt="Profile"
          className="h-10 w-10 rounded-full object-cover border-2 border-white"
        />
      );
    } else {
      return (
        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white text-black">
          <RiUser3Line size={24} />
        </div>
      );
    }
  };

  return (
    <nav className="w-full bg-[#0f0f0f] px-4 sm:px-6 md:px-10 lg:px-16">
      <div className="flex justify-between h-[90px] items-center">
        <Link to="/" className="font-semibold text-4xl cursor-pointer">
          FeedBack
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex gap-12 items-center font-light text-xl">
          <button onClick={() => handleNavClick("home")} className="hover:text-yellow-500 cursor-pointer">
            Home
          </button>
          <button onClick={() => handleNavClick("about")} className="hover:text-yellow-500 cursor-pointer">
            About
          </button>
          <button onClick={() => handleNavClick("testimonials")} className="hover:text-yellow-500 cursor-pointer">
            Testimonials
          </button>
        </div>

        {/* Desktop profile and theme icon */}
        <div className="hidden md:flex items-center gap-4">
          <RiSunFill className="cursor-pointer" size={22} />
          <Link to="/user/profile" className="cursor-pointer">
            {renderProfileIcon()}
          </Link>
        </div>

        {/* Mobile menu button + profile */}
        <div className="md:hidden flex items-center gap-4">
          <button onClick={toggleMenu}>
            {isOpen ? <X size={28} /> : <Menu size={40} />}
          </button>
          <Link to="/user/profile" className="cursor-pointer">
            {renderProfileIcon()}
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-[radial-gradient(circle_at_center,_#1a1a1a,_#000000)] h-screen overflow-hidden flex flex-col justify-center items-center gap-8 pt-24 z-50">
          <div className="absolute top-6 right-6">
            <button
              onClick={toggleMenu}
              className="p-4 bg-[#2c2c2c] rounded-full hover:bg-[#E3E3DB] hover:text-black"
            >
              <X size={28} />
            </button>
          </div>
          <button onClick={() => handleNavClick("home", true)} className="text-3xl font-semibold">
            Home
          </button>
          <button onClick={() => handleNavClick("about", true)} className="text-3xl font-semibold">
            About
          </button>
          <button onClick={() => handleNavClick("testimonials", true)} className="text-3xl font-semibold">
            Testimonials
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
