import React from "react";
import Container from "./Container";
import {
  FaFacebook,
  FaFacebookSquare,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";
import { FaSquareInstagram } from "react-icons/fa6";

export default function Footer() {
  return (
    <div className="bg-black text-yellow-500 md:p-5 p-2">
      <Container>
        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
          <div className="space-y-3">
            <img width={200} src="/images/logo.png" alt="" />
            <p>
              We’re fashion visionaries who bring your ideas to life through
              stunning digital experiences. We understand your brand, your vibe,
              and your audience—then design every detail to reflect your style.
              From concept to creation, we use thoughtful design and smart tech
              to elevate your fashion business.
            </p>
            <div className="flex items-center gap-2">
              <FaFacebookSquare className=" cursor-pointer" />
              <FaTwitter className=" cursor-pointer" />
              <FaSquareInstagram className=" cursor-pointer" />
              <FaLinkedin className=" cursor-pointer" />
            </div>
          </div>
          <div className="space-y-3">
            <h1 className="font-semibold text-[22px]">Company</h1>
            <div>About Us</div>
            <div>Our Services</div>
            <div>Plans & Offers</div>
          </div>
          <div className="space-y-3">
            <h1 className="font-semibold text-[22px]">Get Help</h1>
            <div>FAQ</div>
            <div>Email</div>
            <div>Phone</div>
            <div>Contact Us</div>
          </div>

          <div className="space-y-3 pe-4">
            <h1 className="font-semibold text-[22px]">Contact Us</h1>
            <div className="w-full h-50 flex justify-center">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3535.4715492878927!2d75.13443237491958!3d27.609908729783214!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396ca568c789ee5d%3A0xe1f049c124c8208d!2sUKF%20Outlet!5e0!3m2!1sen!2sin!4v1752668000518!5m2!1sen!2sin"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              ></iframe>
            </div>
            <div>+91 87419 30153</div>
            <div>info@ukf-outlets.in</div>
          </div>
          {/* <div className="space-y-3">
            <h1 className='font-semibold text-[22px]'>Subscribe to Our Newsletter…</h1>
            <div className='flex border bg-white items-center gap-2 rounded'><input type="text" placeholder='Email (e.g. someone@hosi' className='w-full h-full p-2 outline-none ' /><button className='p-2 rounded-e font-semibold text-white bg-[#122d4a] cursor-pointer'>Susbrices</button></div>
          </div> */}
          {/* <div className="space-y-3 md:col-span-2">
            <h1 className='font-semibold text-[22px]'>Quick Contact</h1>
            <form>
              <input type="text" className='w-full mt-2 p-2 border border-gray-300 outline-none rounded' placeholder='Name' />
              <input type="text" className='w-full mt-2 p-2 border border-gray-300 outline-none rounded' placeholder='Email' />
              <textarea rows={'3'} placeholder='Message' className='w-full mt-2 p-2 border border-gray-300 outline-none rounded'></textarea>
              <button type='submit' className='w-full p-2 bg-white outline-none rounded mt-2 font-semibold text-black cursor-pointer'>SEND</button>
            </form>
          </div> */}
          {/* <div className="space-y-3">
            <h1 className='font-semibold text-[22px]'>Follow Us</h1>
            <div className='flex items-center gap-2'>
              <FaFacebookSquare className='text-white cursor-pointer' size={30} />
              <FaTwitter className='text-white cursor-pointer' size={30} />
              <FaSquareInstagram className=' cursor-pointer' size={30} />
              <FaLinkedin className='text-white cursor-pointer' size={30} />
            </div>
          </div> */}
        </div>
      </Container>
    </div>
  );
}
