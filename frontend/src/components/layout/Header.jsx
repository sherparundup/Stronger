import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext.jsx";
import toast from "react-hot-toast";
import { AiOutlineShoppingCart } from "react-icons/ai";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const logout = () => {
    setAuth({ user: null, token: "" });
    localStorage.removeItem("auth");
    localStorage.removeItem("googleFitToken");
    toast.success("Logged out successfully");
    navigate("/");
  };

  // Conditional rendering based on user role
  const isAdminOrCoach = auth?.user?.role === "admin" || auth?.user?.role === "coach";

  return (
    // Only show the nav if the user is not admin or coach
    !isAdminOrCoach && (
      <nav className="bg-black text-white border-b border-gray-800">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between p-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            STRONGER
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  mobileMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>

          {/* Links */}
          <div
            className={`${
              mobileMenuOpen ? "block" : "hidden"
            } w-full md:flex md:items-center md:w-auto`}
          >
            <ul className="flex flex-col md:flex-row md:space-x-6">
              <li>
                <Link
                  to="/AboutPage"
                  className="block px-3 py-2 hover:bg-gray-700 rounded-md"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/ProductsPage"
                  className="block px-3 py-2 hover:bg-gray-700 rounded-md"
                >
                  Our Products
                </Link>
              </li>
              <li>
                <Link
                  to="/CoachPage"
                  className="block px-3 py-2 hover:bg-gray-700 rounded-md"
                >
                  Our Coaches
                </Link>
              </li>
              <li>
                <Link
                  to="/Membership"
                  className="block px-3 py-2 hover:bg-gray-700 rounded-md"
                >
                  Membership
                </Link>
              </li>

              {!auth?.user ? (
                <>
                  <li>
                    <Link
                      to="/login"
                      className="block px-3 py-2 hover:bg-gray-700 rounded-md"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="block px-3 py-2 hover:bg-gray-700 rounded-md"
                    >
                      Sign Up
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="relative">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center px-3 py-2 hover:bg-gray-700 rounded-md"
                    >
                      {auth.user.name}
                      <svg
                        className={`w-4 h-4 ml-1 transform ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50">
                        <Link
                          to={`/${
                            auth.user.role === "admin"
                              ? "admin"
                              : auth.user.role === "coach"
                              ? "coach"
                              : ""
                          }dashboard`}
                          className="block px-4 py-2 hover:bg-gray-700"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <button
                          onClick={logout}
                          className="w-full text-left px-4 py-2 hover:bg-gray-700"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </li>
                  <li>
                    <Link
                      to="/dashboard/MyCart"
                      className=" px-3 py-2 hover:bg-gray-700 rounded-md flex items-center"
                    >
                      <AiOutlineShoppingCart size={20} />
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    )
  );
};

export default Header;
 