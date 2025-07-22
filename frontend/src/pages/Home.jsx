import React from 'react'
import shirt from '../assets/images/shirts.avif'
import denim from '../assets/images/denim.jpg'
import tees from '../assets/images/tees.jpg'
import pants from '../assets/images/pants.webp'
import sweaters from '../assets/images/sweaters.jpeg'
import outwear from '../assets/images/outwear.jpeg'
import maninsuit from '../assets/images/maninsuit.jpg'
import maninwinter from '../assets/images/maninwinter.avif'
import maninsweater from '../assets/images/maninsweater.jpg'
import forest from '../assets/images/forest.jpeg'
import { PiPackage } from "react-icons/pi";
import { PiRecycleThin } from "react-icons/pi";
import { CiLocationOn } from "react-icons/ci";


const Home = () => {
  return (
    <div className=''>
      {/* HeroSection */}

        <div className='w-full h-full relative'>
        <video
                autoPlay
                muted
                playsInline
                loop
                
                className="w-full"
                key={open} 
            >
                <source src='https://m.media-amazon.com/images/S/al-eu-726f4d26-7fdb/8efe297b-b78d-4a43-954a-8b8fbc2ab804.mp4/productVideoOptimized.mp4' type="video/mp4" />
            </video>
            <div className='w-[230px] h-[150px] flex flex-col gap-2 lg:gap-5  absolute top-8 left-5 lg:w-[800px] lg:h-[400px]  lg:top-70 lg:left-25'>
                <div className='text-white text-3xl font-bold text-shadow-stone-950 lg:text-6xl '>
                    Your Cozy Era
                </div>
                <div className='text-white text-shadow-stone-950 lg:text-3xl '>
                    Get peak comfy check <br />
                    with new winter essentials.
                </div>
                <button className='w-[120px] h-[40px] bg-white rounded-2xl font-semibold shadow-2xl lg:w-[250px] lg:h-[45px] lg:text-2xl text-yellow-500'>
                    SHOP NOW
                </button>
            </div>
    </div>

    {/* Shop By Category Section */}
    <div className='flex mt-5 flex-col items-center'>
        <div className='text-2xl text-shadow-black'>
            Shop By Category
        </div>
        <div className='lg:flex lg:gap-4'>

                <div className='mt-4 cursor-pointer hover:scale-105 '>
            <div className='w-[65vw] bg-yellow-500 rounded-3xl flex justify-center items-center h-[80vw] lg:h-[30vh] lg:w-[11vw] shadow-2xl'>
                <img src={shirt} alt="shirt" className='w-[60vw] h-[75vw] lg:h-[28vh] lg:w-[10vw] rounded-3xl' />
            </div>
            <div className='flex justify-center mt-2 text-xl text-slate-700 '>
                Shirts
            </div>
        </div>
         <div className='mt-4 cursor-pointer hover:scale-105'>
            <div className='w-[65vw] bg-yellow-500 rounded-3xl flex justify-center items-center h-[80vw] lg:h-[30vh] lg:w-[11vw] shadow-2xl'>
                <img src={tees} alt="shirt" className='w-[60vw] h-[75vw] lg:h-[28vh] lg:w-[10vw] rounded-3xl' />
            </div>
            <div className='w-full flex justify-center mt-2 text-xl text-slate-700 '>
                Tees
            </div>
        </div>
         <div className='mt-4 cursor-pointer hover:scale-105'>
            <div className='w-[65vw] bg-yellow-500 rounded-3xl flex justify-center items-center h-[80vw] lg:h-[30vh] lg:w-[11vw] shadow-2xl'>
                <img src={denim} alt="shirt" className='w-[60vw] h-[75vw] lg:h-[28vh] lg:w-[10vw] rounded-3xl' />
            </div>
            <div className='w-full flex justify-center mt-2 text-xl text-slate-700 '>
                Denim
            </div>
        </div>
         <div className='mt-4 cursor-pointer hover:scale-105'>
            <div className='w-[65vw] bg-yellow-500 rounded-3xl flex justify-center items-center h-[80vw] lg:h-[30vh] lg:w-[11vw] shadow-2xl'>
                <img src={pants} alt="shirt" className='w-[60vw] h-[75vw] lg:h-[28vh] lg:w-[10vw] rounded-3xl' />
            </div>
            <div className='w-full flex justify-center mt-2 text-xl text-slate-700 '>
                Pants
            </div>
        </div>
         <div className='mt-4 cursor-pointer hover:scale-105'>
            <div className='w-[65vw] bg-yellow-500 rounded-3xl flex justify-center items-center h-[80vw] lg:h-[30vh] lg:w-[11vw] shadow-2xl'>
                <img src={sweaters} alt="shirt" className='w-[60vw] h-[75vw] lg:h-[28vh] lg:w-[10vw] rounded-3xl' />
            </div>
            <div className='w-full flex justify-center mt-2 text-xl text-slate-700 '>
                Sweaters
            </div>
        </div>
         <div className='mt-4 cursor-pointer hover:scale-105'>
            <div className='w-[65vw] bg-yellow-500 rounded-3xl flex justify-center items-center h-[80vw] lg:h-[30vh] lg:w-[11vw] shadow-2xl'>
                <img src={outwear} alt="shirt" className='w-[60vw] h-[75vw] lg:h-[28vh] lg:w-[10vw] rounded-3xl' />
            </div>
            <div className='w-full flex justify-center mt-2 text-xl text-slate-700 '>
                Outwear
            </div>
        </div>

        </div>
    </div>

    {/* section with three pics */}
    <div className='mt-5 flex flex-col lg:flex-row gap-5 lg:justify-center'>
        <div className='flex justify-center rounded-3xl relative'>
            <img src={maninsuit} className='w-[90vw] lg:w-[30vw] rounded-3xl shadow-2xl' alt="man in suit" />
            <div className='absolute  h-[20vh] w-[80vw] top-[40%] lg:w-[25vw] flex flex-col items-center'>
                <h2 className='text-3xl text-white'>New Arrivals</h2>
                <button className='w-[50vw] lg:w-[15vw] h-[7vh] mt-2 rounded-full text-xl bg-white'>
                    Shop the latest
                </button>
            </div>
        </div>

         <div className='flex justify-center rounded-3xl relative '>
            <img src={maninwinter} className='w-[90vw] lg:w-[30vw] rounded-3xl shadow-2xl' alt="man in suit" />
            <div className='absolute  h-[20vh] w-[80vw] top-[40%] lg:w-[25vw] flex flex-col items-center'>
                <h2 className='text-3xl text-white'>Best - Sellers</h2>
                <button className='w-[70vw] lg:w-[18vw] h-[7vh] mt-2 rounded-full text-xl bg-white'>
                    Shop Your Favourites
                </button>
            </div>
        </div>

         <div className='flex justify-center rounded-3xl relative '>
            <img src={maninsweater} className='w-[90vw] lg:w-[30vw] rounded-3xl shadow-2xl' alt="man in suit" />
            <div className='absolute  h-[20vh] w-[80vw] top-[40%] lg:w-[25vw] flex flex-col items-center'>
                <h2 className='text-3xl text-white'>The Holiday Outfit</h2>
                <button className='w-[70vw] lg:w-[15vw] h-[7vh] mt-2 rounded-full text-xl bg-white'>
                    Shop Occasion
                </button>
            </div>
        </div>
    </div>

    {/* learn more */}

    <div className='flex justify-center my-5 relative'>
        <img src={forest} className='w-[95vw] h-[40vh] rounded-lg' alt="learn more pic" />
        <div className='absolute w-[90vw] h-[35vh] pl-2 top-5 flex flex-col items-center justify-center gap-3'>
            <div className='text-white text-3xl font-semibold justify-center'>
                We are on a mission to clean up the industry
            </div>
            <div className='text-white text-2xl'>
                Read about us
            </div>
            <button className='w-[70vw] lg:w-[15vw] h-[7vh] mt-2 rounded-full text-xl bg-white'>
                Learn More
            </button>

        </div>
    </div>

    {/* Slider */}

    {/* Comments */}

    {/* logoContainer */}
    <div className='w-[100vw] flex flex-col items-center gap-5 justify-center my-5 lg:flex-row lg:gap-0 lg:my-10' >
        <div className='w-[90vw] flex flex-col items-center'>
            <PiPackage size={100}/>
            <div className='text-2xl'>
                Complimentary Shipping
            </div>
            <div>
                Enjoy the shipping to your doors
            </div>
        </div>

        <div className='w-[90vw] flex flex-col items-center'>
            <PiRecycleThin size={100}/>
            <div className='text-2xl'>
                Consciously Carfted
            </div>
            <div>
                Designed for you
            </div>
        </div>

        <div className='w-[90vw] flex flex-col items-center'>
            <CiLocationOn size={100}/>
            <div className='text-2xl'>
                Come Say Hi
            </div>
            <div>
                Visit our store    
            </div>
        </div>
    </div>

    </div>
  )
}

export default Home
