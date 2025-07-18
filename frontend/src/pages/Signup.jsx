import React, { useEffect, useState } from "react";
import { endpoints } from "../services/api";
import { apiConnector } from "../services/apiConnector";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setRole, setUserData, setToken } from "../slices/authSlice";

const { SIGN_UP } = endpoints;

export default function Signup() {

    const loading = useSelector((state)=>state.auth.loading)
    const token = useSelector(state=>state.auth.token);
     const userData = useSelector(state => state.auth.userData)
     const accountType = useSelector(state => state.auth.accountType)

    const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

        dispatch(setLoading(true));
      const response = await apiConnector("POST", SIGN_UP, formData);

      console.log(response);

      toast.success("Registered Successfully!");

        dispatch(setUserData(response.data.user))
        dispatch(setToken(response.data.user.token))
        dispatch(setRole(response.data.user.accountType))

      setFormData({
        name: "",
        phone: "",
        password: "",
      });

      if(response.data.user.accountType === "user"){
      navigate("/Home");
      }
      else{
        navigate("/admindashboard")
      }
    } catch (err) {
      console.log(err);
      toast.error("Unable to register!");
    }finally{
        dispatch(setLoading(false))
    }
  };

  useEffect(()=>{
  if(token){
    if(accountType === "user"){
      navigate("/Home");
      }
      else{
        navigate("/admindashboard")
      };
    toast.success(`Welcome! ${userData.name}`);
  }
  },[])

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-black text-[#FFD700] border border-gold rounded-lg p-8 w-full max-w-md shadow-xl"
      >
        <h2 className="text-3xl font-semibold text-[#FFD700] mb-6 text-center">
          Sign Up
        </h2>

        <label className="block mb-4">
          <span className="text-[#FFD700] font-medium">Name</span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className="w-full mt-1 p-3 rounded bg-transparent border border-gold text-white placeholder-gold focus:outline-none focus:ring-2 focus:ring-gold"
            required
          />
        </label>

        <label className="block mb-4">
          <span className="text-[#FFD700] font-medium">Phone</span>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            className="w-full mt-1 p-3 rounded bg-transparent border border-gold text-white placeholder-gold focus:outline-none focus:ring-2 focus:ring-gold"
            required
          />
        </label>

        <label className="block mb-6">
          <span className="text-[#FFD700] font-medium">Password</span>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            className="w-full mt-1 p-3 rounded bg-transparent border border-gold text-white placeholder-gold focus:outline-none focus:ring-2 focus:ring-gold"
            required
          />
        </label>

        <button
          type="submit"
          className="w-full py-3 bg-[#FFD700] text-black font-semibold rounded hover:bg-slate-700 hover:text-[#FFD700] transition-all duration-300"
        >
          {
            loading ? (<div className="loader1"></div>):(<>Create Account</>)
          }
        </button>

        <div className=" w-[full] flex justify-center mt-5 cursor-pointer underline" onClick={()=>navigate('/login')}>
            Already have an account
        </div>
      </form>
    </div>
  );
}
