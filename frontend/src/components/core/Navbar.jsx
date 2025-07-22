import React, { useEffect, useState } from "react";
import logo from "../../assets/images/LOGO.jpg";
import { FaSearch } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setRole, setUserData, setToken } from "../../slices/authSlice";
import toast from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";
import womensfashion from "../../assets/images/womens fashion.webp";
import mensfashion from "../../assets/images/mensfashion.webp";
import perfumes from "../../assets/images/perfumes.webp";
import accessories from "../../assets/images/accessories.jpg";
import { setSearchData } from "../../slices/searchSlice";
import { updateFilter } from "../../slices/filterSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showSearch, setShowSearch] = useState(false);

  const [searchBar, setSearchBar] = useState("");

  const token = useSelector((state) => state.auth.token);
  const search = useSelector((state) => state.search.searchData);

    const cartItems = useSelector(state=> state.cart.totalItems)

  const logoutHandler = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userdata");

      dispatch(setToken(null));
      dispatch(setUserData(null));
      dispatch(setRole(null));

      toast.success("Logged out Successfully!");
      navigate("/");
    } catch (err) {
      console.log(err);
      toast.error("unable to LogOut");
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
                      value: "Male",
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
              <NavLink to='/products' onClick={()=> dispatch(updateFilter({type:'gender',value:'Female',checked:true}))} className="h-[9vh] flex items-center justify-center w-[4vw] cursor-pointer">
                Women
              </NavLink>
              <div className="opacity-0 group-hover:opacity-100 w-[4vw] h-[1px] bg-[#FFD700]"></div>
            </li>

            <li className="group flex flex-col justify-between relative">
              <NavLink  to='/products' onClick={()=> dispatch(updateFilter({type:'categories',value:'Perfume',checked:true}))} className="h-[9vh] flex items-center justify-center w-[4vw] cursor-pointer">
                Perfume
              </NavLink>
              <div className="opacity-0 group-hover:opacity-100 w-[4vw] h-[1px] bg-[#FFD700]"></div>
            </li>
            <li className="group flex flex-col justify-between relative">
              <NavLink
                to="/products"
                 onClick={()=> dispatch(updateFilter({type:'categories',value:'Wallet',checked:true}))}
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
          </ul>
        </div>

        <div className="flex gap-4 text-xl">
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
                        <div>
                          <img
                            src={womensfashion}
                            alt="image1"
                            className="rounded-2xl mb-2 shadow-2xl h-[25vh] lg:w-[23vh]"
                          />
                        </div>
                        <div className="text-xs">Women's Fashion</div>
                      </div>
                      <div className="w-[40vw] lg:w-[20vw] flex flex-col items-center ">
                        <div>
                          <img
                            src={mensfashion}
                            alt="image2"
                            className="rounded-2xl mb-2 shadow-2xl h-[25vh] lg:w-[23vh]"
                          />
                        </div>
                        <div className="text-xs">Men's Fashion</div>
                      </div>
                    </div>
                    <div className="flex justify-around">
                      <div className="w-[40vw] lg:w-[20vw] flex flex-col items-center ">
                        <div>
                          <img
                            src={perfumes}
                            alt="image3"
                            className="rounded-2xl mb-2 shadow-2xl h-[25vh]"
                          />
                        </div>
                        <div className="text-xs">Perfumes</div>
                      </div>
                      <div className="w-[40vw] lg:w-[20vw] flex flex-col items-center ">
                        <div>
                          <img
                            src={accessories}
                            alt="image2"
                            className="rounded-2xl mb-2 shadow-2xl h-[25vh]"
                          />
                        </div>
                        <div className="text-xs">Accessories</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="relative group">
            <div className="peer cursor-pointer">
              <FaUser />
            </div>

            <div
              className="absolute opacity-0 pointer-events-none w-[150px] h-[150px] bg-[#FFD700] z-[100] left-[-70px] top-[30px] rounded-3xl border border-black shadow-amber-400 
    transition-opacity duration-1000 ease-out 
    group-hover:opacity-100 group-hover:pointer-events-auto 
    flex justify-center items-center"
            >
              {token ? (
                <button
                  onClick={logoutHandler}
                  className="text-black cursor-pointer"
                >
                  LogOut
                </button>
              ) : (
                <button
                  onClick={() => navigate("/")}
                  className="text-black cursor-pointer"
                >
                  Signup
                </button>
              )}
            </div>
          </div>

          
          <div className="relative">
            <FaShoppingCart />
            {
                cartItems && <div className="absolute z-[200] w-5 h-5 bg-[#FFD700] rounded-full top-0 right-0 text-sm text-black -translate-y-1/2 translate-x-1/2 flex justify-center items-center"> {cartItems} </div>
            
            }
            </div>
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
