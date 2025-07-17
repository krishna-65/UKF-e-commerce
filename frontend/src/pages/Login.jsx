import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setRole, setToken, setUserData } from '../slices/authSlice';
import { apiConnector } from '../services/apiConnector';
import { endpoints } from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const { LOGIN_API } = endpoints;


export default function Login() {
  const [credentials, setCredentials] = useState({
    phone: '',
    password: '',
  });

  const loading = useSelector(state=>state.auth.loading)
  const navigate = useNavigate();
  const dispatch = useDispatch();

 

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

 const handleLogin = async (e) => {
    e.preventDefault();

    try {

        dispatch(setLoading(true));
      const response = await apiConnector("POST", LOGIN_API, credentials);

      console.log(response);

      toast.success("Logged in Successfully!");

        dispatch(setUserData(response.data.user))
        dispatch(setToken(response.data.user.token))
        dispatch(setRole(response.data.user.accountType))

      setCredentials({

        phone: "",
        password: "",
      });

      navigate("/");
    } catch (err) {
      console.log(err);
      toast.error("Unable to register!");
    }finally{
        dispatch(setLoading(false))
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <form
        onSubmit={handleLogin}
        className="bg-black text-[#FFD700] border border-gold rounded-lg p-8 w-full max-w-md shadow-xl"
      >
        <h2 className="text-3xl font-semibold text-[#FFD700] mb-6 text-center">
          Log In
        </h2>

        <label className="block mb-4">
          <span className="text-[#FFD700] font-medium">Phone</span>
          <input
            type="tel"
            name="phone"
            value={credentials.phone}
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
            value={credentials.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full mt-1 p-3 rounded bg-transparent border border-gold text-white placeholder-gold focus:outline-none focus:ring-2 focus:ring-gold"
            required
          />
        </label>

        <button
          type="submit"
          className="w-full py-3 bg-[#FFD700] text-black font-semibold rounded hover:bg-slate-700 hover:text-[#FFD700] transition-all duration-300"
        >
          {
            loading ? (<div className="loader1"></div>):(<>LogIn</>)
          }
        </button>

          <div className=" w-[full] flex justify-center mt-5 cursor-pointer underline" onClick={()=>navigate('/')}>
            Register an account
        </div>
      </form>
    </div>
  );
}
