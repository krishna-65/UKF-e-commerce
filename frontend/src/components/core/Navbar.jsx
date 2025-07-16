import React from "react";
import logo from "../../assets/images/LOGO.jpg";
import { FaSearch } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";

const Navbar = () => {
  return (
    <>
    <div className="bg-black h-[10vh] text-yellow-500 flex items-center justify-between px-3 lg:px-10 ">

         <img src={logo} className="w-[10vh]" alt="UKF-Outlets" />

        <div className="hidden opacity-0 lg:opacity-100 lg:flex">
            <ul className="flex gap-5">
                <li className="group flex flex-col justify-between relative">
                    <div className="h-[9vh] flex items-center justify-center w-[4vw] cursor-pointer">
                        Men
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 w-[4vw] h-[1px] bg-yellow-500">
                    </div>
                   
                </li>
               <li className="group flex flex-col justify-between">
                    <div className="h-[9vh] flex items-center justify-center w-[4vw] cursor-pointer">
                        Women
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 w-[4vw] h-[1px] bg-yellow-500">
                    </div>
                </li>
                <li className="group flex flex-col justify-between">
                    <div className="h-[9vh] flex items-center justify-center w-[4vw] cursor-pointer">
                        About
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 w-[4vw] h-[1px] bg-yellow-500">
                    </div>
                </li>
                
            </ul>
        </div>
     
      <div className="flex gap-4 text-xl">
        <FaSearch />
        <FaUser />
        <FaShoppingCart />
      </div>
    </div>

    <div className="hidden opacity-0 lg:flex lg:opacity-100 h-[7vh] w-[100vw] bg-yellow-500 text-black justify-center" >
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
    
    </>
  );
};

export default Navbar;
