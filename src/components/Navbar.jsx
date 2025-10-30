import React, { useEffect, useState } from "react";
import { GrSearch } from "react-icons/gr";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { FaShoppingCart } from "react-icons/fa";
import { IoMdCloudUpload } from "react-icons/io";
import { TbNotebook } from "react-icons/tb";
import { HiMenu } from "react-icons/hi";
import { FiLogOut, FiUser, FiSettings } from "react-icons/fi";
import { useAuth } from "./context/AuthContext";
import logo from "./assests/logo223.png";
import navbarImage from "./assests/navbckimg.png";
import homecollect from "./assests/homecollection1.png";
import hospitalimage from "./assests/hospitalimage.png";
import ambulance from "./assests/ambulance3.png";
import { useCart } from "../components/context/CartContext";
import "./Navbar.css";
import { BACKEND_URL } from "../components/utils/Url";

const Navbar = () => {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [allTestNames, setAllTestNames] = useState([]);
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const searchInput = useLocation();
  const { cart } = useCart();
  const URLSearch = new URLSearchParams(searchInput?.search);

  useEffect(() => {
    const URLSearch = new URLSearchParams(searchInput.search);
    const searchQuery = URLSearch.get("q");
    if (searchQuery) {
      setSearch(searchQuery);
    }
  }, [searchInput]);

  // Fetch all test names when component mounts
  useEffect(() => {
    const fetchTestNames = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/subcategories/test-names`
        );
        const data = await response.json();
        if (response.ok) {
          console.log("✅ allTestNames loaded from backend:", data.data);
          setAllTestNames(data.data); // ✅ this should be an array of objects
        } else {
          console.error("❌ Error fetching test names:", data);
        }
      } catch (error) {
        console.error("❌ Network error:", error);
      }
    };

    fetchTestNames();
  }, []);

  // Modify your handleSearch function
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    console.log("🔍 User typed:", value);
    console.log("📦 Searching within:", allTestNames);

    if (value.trim()) {
      const filteredData = allTestNames.filter(
        (item) =>
          item.title.toLowerCase().includes(value.toLowerCase()) ||
          (item.testNo &&
            item.testNo.toLowerCase().includes(value.toLowerCase())) ||
          (item.expertSerialTestNo &&
            item.expertSerialTestNo.toLowerCase().includes(value.toLowerCase()))
      );

      console.log("✅ Filtered Results:", filteredData);
      setSearchResults(filteredData);
      setIsDropdownVisible(true);
    } else {
      setSearchResults([]);
      setIsDropdownVisible(false);
    }
  };

  // Modify your search results display
  const handleResultClick = (result) => {
    navigate(`/test-details/${result._id}`);
    setTimeout(() => {
      setSearch("");
      setIsDropdownVisible(false);
    }, 100); // delay to let navigation finish first
  };

  const handleLogout = () => {
    logout();
    // Optional: You might want to make an API call to your backend logout endpoint
    // axios.post('/person/logout');
    setIsProfileDropdownOpen(false);
    navigate("/"); // Redirect to home after logout
  };

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return "";
    const names = name.split(" ");
    return names
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <>
      {/* Navbar Container */}
      <header
        className="el-messiri-navbar h-16 fixed w-full z-50"
        style={{
          backgroundImage: `url(${navbarImage})`,
          backgroundSize: "cover",
          backgroundPosition: "left start",
          backgroundRepeat: "no-repeat",
          // border:"1px solid red",
        }}
      >
        <div className="container flex items-center justify-between px-4 h-full">
          {/* Logo */}
          <Link to={"/"} style={{ textDecoration: "none" }}>
            <img
              src={logo}
              alt="Logo"
              className="w-[79%] h-14 object-contain sm:h-14 h-10"
            />
            <hr className="w-[65%] ml-[10%] border-t-0.5 border-orange-600" />
            <p className="text-[10px] md:text-[10px] font-bold text-purple-900 mr-[12%]">
              Precision with care
            </p>
          </Link>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-[280px] sm:max-w-sm mx-auto">
            <div className="search-bar flex items-center border border-orange-500 rounded-full pl-2 bg-white w-full h-9 sm:h-11">
              <input
                type="text"
                placeholder="Search product here..."
                className="w-full outline-none bg-transparent text-black placeholder-gray-500 px-2 text-sm sm:text-base"
                onChange={handleSearch}
                value={search}
                onFocus={() => setIsDropdownVisible(!!searchResults.length)}
                onBlur={() =>
                  setTimeout(() => setIsDropdownVisible(false), 200)
                }
              />
              <button className="text-lg bg-orange-500 text-white p-2 sm:p-3 rounded-full">
                <GrSearch />
              </button>
            </div>
          </div>

          {/* Search Results Dropdown */}
          {isDropdownVisible && (
            <div
              className={`absolute top-12 bg-white shadow-lg border rounded-lg z-50 
          w-[65%] left-[65%] mt-[0.6%] transform -translate-x-1/2 
          sm:w-[35%] sm:left-[20%] sm:mt-[0.6%] sm:transform-none search-scrollable`}
              style={{ maxHeight: "250px", overflowY: "auto" }}
            >
              {isLoading ? (
                <p className="p-2 text-gray-500 text-center">Loading...</p>
              ) : searchResults.length > 0 ? (
                searchResults.map((result) => (
                  <div
                    key={result._id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleResultClick(result)}
                  >
                    <p className="text-sm text-gray-500">{result.title}</p>
                    <p className="font-medium ">
                      Test No: {result.testNo} | Serial:{" "}
                      {result.expertSerialTestNo}
                    </p>
                  </div>
                ))
              ) : (
                <p className="p-2 text-gray-500 text-center">
                  No results found.
                </p>
              )}
            </div>
          )}

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-10 ">
            <button
              onClick={() => setShowForm(true)}
              className=" flex items-center text-white text-sm font-bold py-2 px-4 hover:text-orange-500"
            >
              <TbNotebook className="mr-1 relative -top-0 text-lg" />
              Book Test
            </button>
            <Link
              to="/upload-prescription"
              className="flex items-center text-white text-sm font-bold py-2 px-4 hover:text-orange-500 no-underline hover:no-underline"
            >
              <IoMdCloudUpload className="mr-1 relative -top-0 text-lg  " />
              Upload Prescription
            </Link>
            <Link to="/cart" className="relative text-white text-lg">
              <FaShoppingCart />
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1"></span>
            </Link>

            {/* Profile Dropdown */}
            {token ? (
              <div className="relative">
                <button
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-[#eb7801] text-[#ffffff] font-bold hover:bg-transparent hover:border hover:border-[#ad70d5] transition"
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                >
                  {user?.name ? getInitials(user.name) : <FiUser />}
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.name || "User"}
                      </p>
                      {user?.email && (
                        <p className="text-xs text-gray-500">{user.email}</p>
                      )}
                      {user?.mobile && (
                        <p className="text-xs text-gray-500">{user.mobile}</p>
                      )}
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <FiUser className="mr-2" /> My Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <FiSettings className="mr-2" /> Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <FiLogOut className="mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/log-in"
                className="text-white bg-[#eb7801] hover:bg-orange-700 px-4 py-2 rounded-full text-sm no-underline hover:no-underline"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-2xl text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <HiMenu />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-30 left-0 w-full bg-white shadow-md z-40">
            <div className="flex flex-col items-start p-4 space-y-4">
              <button
                onClick={() => {
                  setShowForm(true);
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center text-gray-800 text-sm font-bold hover:text-orange-700"
              >
                <TbNotebook className="mr-1 relative -top-0 text-lg" />
                Book Test
              </button>
              <Link
                to="/upload-prescription"
                className="flex items-center text-gray-800 text-sm font-bold hover:text-orange-700 no-underline hover:no-underline"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <IoMdCloudUpload className="mr-1 relative -top-0 text-lg" />
                Upload Prescription
              </Link>

              <Link
                to="/cart"
                className="flex items-center text-gray-800 text-sm font-bold hover:text-orange-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaShoppingCart className="mr-1 relative -top-0 text-lg " />
                Cartt ({cart.length})
              </Link>

              {token ? (
                <>
                  <Link
                    to="/profile"
                    className="text-sm font-bold text-white bg-[#603c86] hover:bg-orange-700 px-4 py-2 rounded-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-bold text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/log-in"
                  className="text-sm font-bold text-white bg-[#eb7801] hover:bg-orange-700 px-4 py-2 rounded-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Modal for Booking Tests */}
      {showForm && (
        <div
          className="fixed inset-0 bg-blue bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-white bg-opacity-90 p-4 md:p-8 w-[90%] md:w-[70%] lg:w-[50%] max-w-3xl rounded-lg shadow-lg relative flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-red-500"
              onClick={() => setShowForm(false)}
            >
              <IoClose size={24} />
            </button>
            <h2 className="text-lg md:text-xl font-bold mb-4 text-center">
              Book Your Test
            </h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div
                className="flex flex-col items-center cursor-pointer border border-gray-500 bg-white rounded-lg p-4 transition-transform duration-300 hover:shadow-lg hover:scale-105 w-full md:w-1/2"
                onClick={() => {
                  setShowForm(false);
                  navigate("/ambulance-service");
                }}
              >
                <img
                  src={ambulance}
                  alt="Ambulance Service"
                  className="w-28 h-16 md:w-40 md:h-20 object-cover"
                />
                <p className="mt-5 text-sm md:text-base font-bold">
                  Ambulance Service
                </p>
              </div>
              <div
                className="flex flex-col items-center cursor-pointer border border-gray-500 bg-white rounded-lg p-4 transition-transform duration-300 hover:shadow-lg hover:scale-105 w-full md:w-1/2"
                onClick={() => {
                  setShowForm(false);
                  navigate("/home-collection");
                }}
              >
                <img
                  src={homecollect}
                  alt="Home Collection"
                  className="w-28 h-16 md:w-40 md:h-20 object-cover"
                />
                <p className="mt-5 text-sm md:text-base">Home Collection</p>
              </div>
              <div
                className="flex flex-col items-center cursor-pointer border border-gray-500 bg-white rounded-lg p-4 transition-transform duration-300 hover:shadow-lg hover:scale-105 w-full md:w-1/2"
                onClick={() => {
                  setShowForm(false);
                  navigate("/book-appointment");
                }}
              >
                <img
                  src={hospitalimage}
                  alt="Book Appointment"
                  className="w-28 h-16 md:w-40 md:h-20 object-cover"
                />
                <p className="mt-5 text-sm md:text-base">Book Appointment</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
