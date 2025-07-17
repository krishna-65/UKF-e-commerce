import React, { useState } from 'react';
import { endpoints } from '../services/api';
import { apiConnector } from '../services/apiConnector';
import toast from 'react-hot-toast';

const  {SIGN_UP} = endpoints;

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
        const response = await apiConnector('POST',SIGN_UP,formData);

        console.log(response);

        toast.success("Registered Successfully!")


    }catch(err){

        console.log(err)
        toast.error("Unable to register!")

    }
    
  };

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
          className="w-full py-3 bg-[#FFD700] text-black font-semibold rounded hover:bg-black hover:text-[#FFD700] transition-all duration-300"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}
