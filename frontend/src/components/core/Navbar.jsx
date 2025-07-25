import React, { useEffect, useState } from "react";
import logo from "../../assets/images/LOGO.jpg";
import { FaSearch } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setRole, setUserData, setToken } from "../../slices/authSlice";
import toast from "react-hot-toast";
import { Link, NavLink, useNavigate } from "react-router-dom";
import womensfashion from "../../assets/images/womens fashion.webp";
import mensfashion from "../../assets/images/mensfashion.webp";
import perfumes from "../../assets/images/perfumes.webp";
import accessories from "../../assets/images/accessories.jpg";
import { setSearchData } from "../../slices/searchSlice";
import { updateFilter } from "../../slices/filterSlice";
import CartSidebar from "../rest-comp/CartSidebar";
import { IoIosLogOut } from "react-icons/io";
import { resetCart } from "../../slices/cartSlice";
import { cartEndpoints } from "../../services/api";
import { apiConnector } from "../../services/apiConnector";

const { bulkCart } = cartEndpoints;

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showSearch, setShowSearch] = useState(false);

  const [searchBar, setSearchBar] = useState("");

  const token = useSelector((state) => state.auth.token);
  const search = useSelector((state) => state.search.searchData);

  const cartItems = useSelector((state) => state.cart.totalItems);
  const cart = useSelector((state) => state.cart.cart);

  const user = useSelector((state) => state.auth.userData);

  // Add loading state
  const [isSavingCart, setIsSavingCart] = useState(false);

  // Improved saveCart function
  const saveCart = async () => {
    if (!user?._id || cart.length === 0) return;

    try {
      setIsSavingCart(true);

      const cartItems = cart.map((item) => ({
        productId: item._id, // Assuming product ID is directly on item
        quantity: item.quantity,
        price: item.price,
      }));

      console.log("the cart is : ", cart);

      const response = await apiConnector(
        "POST",
        `${bulkCart}${user._id}/bulk`,
        { items: cartItems }
      );

      console.log("save cart response", response);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to save cart");
      }

      toast.success("Cart saved successfully");
    } catch (error) {
      console.error("Error saving cart:", error);
      toast.error("Failed to save cart");
    } finally {
      setIsSavingCart(false);
    }
  };

  const logoutHandler = async () => {
    try {
      if (user.accountType === "user") {
        if (cart.length > 0) {
          await saveCart(); // Wait for cart to be saved
        }
      }

      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userdata");

      // Clear Redux state
      dispatch(setToken(null));
      dispatch(setUserData(null));
      dispatch(setRole(null));
      dispatch(resetCart());

      toast.success("Logged out Successfully!");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Unable to logout. Please try again.");
    }
  };

  const searchHandler = () => {
    dispatch(setSearchData(searchBar));

    navigate("/products");
    setShowSearch(false);
    setSearchBar("");

    toast.success(`Results for ${searchBar}`);
  };

  return (
    <div className="fixed top-0 w-full z-100">
      <div className="bg-black h-[10vh] text-[#FFD700] flex items-center justify-between px-3 lg:px-10 ">
        <img
          src={logo}
          className="w-[10vh] ml-10 cursor-pointer lg:ml-0"
          onClick={() => navigate("/Home")}
          alt="UKF-Outlets"
        />

        <div className="hidden opacity-0 lg:opacity-100 lg:flex">
          <ul className="flex gap-5">
            <li className="group flex flex-col justify-between relative">
              <NavLink
                to="/products"
                onClick={() => {
                  // Clear existing gender filters first
                  dispatch(
                    updateFilter({ type: "gender", value: [], checked: false })
                  );
                  // Then set the new filter
                  dispatch(
                    updateFilter({
                      type: "gender",
                      value: "Men",
                      checked: true,
                    })
                  );
                }}
                className="h-[9vh] flex items-center justify-center w-[4vw] cursor-pointer"
              >
                Men
              </NavLink>
              <div className="opacity-0 group-hover:opacity-100 w-[4vw] h-[1px] bg-[#FFD700]"></div>
            </li>
            <li className="group flex flex-col justify-between">
              <NavLink
                to="/products"
                onClick={() =>
                  dispatch(
                    updateFilter({
                      type: "gender",
                      value: "Women",
                      checked: true,
                    })
                  )
                }
                className="h-[9vh] flex items-center justify-center w-[4vw] cursor-pointer"
              >
                Women
              </NavLink>
              <div className="opacity-0 group-hover:opacity-100 w-[4vw] h-[1px] bg-[#FFD700]"></div>
            </li>

            <li className="group flex flex-col justify-between relative">
              <NavLink
                to="/products"
                onClick={() =>
                  dispatch(
                    updateFilter({
                      type: "categories",
                      value: "Perfume",
                      checked: true,
                    })
                  )
                }
                className="h-[9vh] flex items-center justify-center w-[4vw] cursor-pointer"
              >
                Perfume
              </NavLink>
              <div className="opacity-0 group-hover:opacity-100 w-[4vw] h-[1px] bg-[#FFD700]"></div>
            </li>
            <li className="group flex flex-col justify-between relative">
              <NavLink
                to="/products"
                onClick={() =>
                  dispatch(
                    updateFilter({
                      type: "categories",
                      value: "Wallet",
                      checked: true,
                    })
                  )
                }
                className="h-[9vh] flex items-center justify-center w-[6vw] cursor-pointer"
              >
                Accessories
              </NavLink>
              <div className="opacity-0 group-hover:opacity-100 w-[6vw] h-[1px] bg-[#FFD700]"></div>
            </li>

            <li className="group flex flex-col justify-between">
              <NavLink
                to="/about"
                className="h-[9vh] flex items-center justify-center w-[4vw] cursor-pointer"
              >
                About
              </NavLink>
              <div className="opacity-0 group-hover:opacity-100 w-[4vw] h-[1px] bg-[#FFD700]"></div>
            </li>

            <li className="group flex flex-col justify-between">
              <NavLink
                to="/contactus"
                className="h-[9vh] flex items-center justify-center w-[6vw] cursor-pointer"
              >
                Contact Us
              </NavLink>
              <div className="opacity-0 group-hover:opacity-100 w-[6vw] h-[1px] bg-[#FFD700]"></div>
            </li>
          </ul>
        </div>

        <div className="flex gap-4 text-xl">
          {user?.accountType === "user" && (
            <div className=" relative">
              <FaSearch onClick={() => setShowSearch(!showSearch)} />
              {showSearch && (
                <div className=" absolute  top-11  left-[-71vw] lg:left-[-1404px] z-[102] shadow-2xl w-[100vw] pb-10 bg-[#FFD700]">
                  {/* searchBar */}
                  <div className="w-[full] h-[13vh] broder border-b-2 shadow-lg flex justify-center items-center relative ">
                    <div
                      onClick={() => setShowSearch(false)}
                      className="text-red-500 hidden  cursor-pointer absolute top-2 w-[25px] h-[25px] lg:flex justify-center items-center  right-5 border-4 border-red-500 font-bold  rounded-full"
                    >
                      x
                    </div>
                    <div className="flex gap-0 ">
                      <input
                        type="text"
                        placeholder="Search..."
                        onChange={(e) => setSearchBar(e.target.value)}
                        className="bg-black h-[8vh]  pl-4 text-[#ffd700] placeholder:text-[#FFD700] lg:w-[50vw] border-black rounded-l-2xl"
                      />
                      <button
                        className="bg-black h-[8vh] w-[15vw] lg:w-[5vw] flex justify-center items-center rounded-r-2xl "
                        onClick={searchHandler}
                      >
                        <FaSearch />
                      </button>
                    </div>
                  </div>

                  {/* categories and new */}

                  <div className="text-black">
                    <h2 className="w-[100vw] flex justify-center my-4  font-semibold lg:text-3xl">
                      Popular Categories
                    </h2>
                    <div className="flex flex-col gap-5 lg:flex-row lg:justify-center lg:w-[100vw]">
                      <div className="flex justify-around ">
                        <div className="w-[40vw] lg:w-[20vw] flex flex-col items-center ">
                          <Link
                            to="/products"
                            onClick={() =>
                              dispatch(
                                updateFilter({
                                  type: "gender",
                                  value: "Women",
                                  checked: true,
                                })
                              )
                            }
                          >
                            <img
                              src={womensfashion}
                              onClick={() => setShowSearch(false)}
                              alt="image1"
                              className="rounded-2xl mb-2 shadow-2xl h-[25vh] lg:w-[23vh]"
                            />
                          </Link>
                          <div className="text-xs">Women's Fashion</div>
                        </div>
                        <div className="w-[40vw] lg:w-[20vw] flex flex-col items-center ">
                          <Link
                            to="/products"
                            onClick={() =>
                              dispatch(
                                updateFilter({
                                  type: "gender",
                                  value: "Men",
                                  checked: true,
                                })
                              )
                            }
                          >
                            <img
                              src={mensfashion}
                              onClick={() => setShowSearch(false)}
                              alt="image2"
                              className="rounded-2xl mb-2 shadow-2xl h-[25vh] lg:w-[23vh]"
                            />
                          </Link>
                          <div className="text-xs">Men's Fashion</div>
                        </div>
                      </div>
                      <div className="flex justify-around">
                        <div className="w-[40vw] lg:w-[20vw] flex flex-col items-center ">
                          <Link
                            to="/products"
                            onClick={() =>
                              dispatch(
                                updateFilter({
                                  type: "categories",
                                  value: "Perfume",
                                  checked: true,
                                })
                              )
                            }
                          >
                            <img
                              src={perfumes}
                              alt="image3"
                              onClick={() => setShowSearch(false)}
                              className="rounded-2xl mb-2 shadow-2xl h-[25vh]"
                            />
                          </Link>
                          <div className="text-xs">Perfumes</div>
                        </div>
                        <div className="w-[40vw] lg:w-[20vw] flex flex-col items-center ">
                          <Link
                            to="/products"
                            onClick={() =>
                              dispatch(
                                updateFilter({
                                  type: "categories",
                                  value: "Belt",
                                  checked: true,
                                })
                              )
                            }
                          >
                            <img
                              src={accessories}
                              onClick={() => setShowSearch(false)}
                              alt="image2"
                              className="rounded-2xl mb-2 shadow-2xl h-[25vh]"
                            />
                          </Link>
                          <div className="text-xs">Accessories</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="relative">
            {token ? (
              <div className="cursor-pointer relative group">
                <FaUser className="text-[#FFD700]" />

                <div className="absolute right-[-60px]  mt-2 w-40 bg-black border border-[#FFD700]/30 rounded-md shadow-lg text-[#FFD700] opacity-0 group-hover:opacity-100 transition duration-300 z-10">
                  <button
                    onClick={() => navigate("/profile")}
                    className="w-full text-left px-4 py-2 flex justify-center hover:bg-[#FFD700] hover:text-black transition duration-200"
                  >
                    Profile
                  </button>
                  <button
                    onClick={logoutHandler}
                    className="w-full text-left px-4 py-2 flex justify-center hover:bg-red-500 hover:text-white transition duration-200"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div onClick={() => navigate("/")} className="cursor-pointer">
                <FaUser className="text-[#FFD700]" />
              </div>
            )}
          </div>

          {user?.accountType === "user" && <CartSidebar />}
        </div>
      </div>

      <div className="hidden opacity-0 lg:flex lg:opacity-100 h-[7vh] w-[100vw] bg-[#FFD700] text-black justify-center">
        <ul className="flex items-center gap-5">
          <li className="hover:scale-105 cursor-pointer">Holiday Gifting</li>
          <li className="hover:scale-105 cursor-pointer">New Arrivals</li>
          <li className="hover:scale-105 cursor-pointer">Best-Sellers</li>
          <li className="hover:scale-105 cursor-pointer">Clothing</li>
          <li className="hover:scale-105 cursor-pointer">Tops & Sweaters</li>
          <li className="hover:scale-105 cursor-pointer">Pants & Jeans</li>
          <li className="hover:scale-105 cursor-pointer">Outerwear</li>
          <li className="hover:scale-105 cursor-pointer">Shoes & Bags</li>
          <li className="text-red-600 hover:scale-105 cursor-pointer">Sale</li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
