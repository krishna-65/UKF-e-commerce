import React, { useEffect, useState } from 'react'
import shirt from '../assets/images/shirts.avif'
import belt from '../assets/images/belt.avif'
import tees from '../assets/images/tees.jpg'
import pants from '../assets/images/pants.webp'
import perfume from '../assets/images/Perfume.webp'
import wallet from '../assets/images/wallet.jpg'
import maninsuit from '../assets/images/maninsuit.jpg'
import maninwinter from '../assets/images/maninwinter.avif'
import maninsweater from '../assets/images/maninsweater.jpg'
import forest from '../assets/images/forest.jpeg'
import { PiPackage } from "react-icons/pi";
import { PiRecycleThin } from "react-icons/pi";
import { CiLocationOn } from "react-icons/ci";
import { useDispatch } from 'react-redux'
import { clearFilters, updateFilter } from '../slices/filterSlice'
import { Link, useNavigate } from 'react-router-dom'

const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        dispatch(clearFilters());
        // Trigger animations after component mounts
        setTimeout(() => setIsVisible(true), 100);
    }, []);

    const categoryData = [
        { name: 'Shirts', image: shirt, filterValue: 'Shirts' },
        { name: 'Tees', image: tees, filterValue: 'T-Shirts' },
        { name: 'Belts', image: belt, filterValue: 'Belt' },
        { name: 'Pants', image: pants, filterValue: 'Pants' },
        { name: 'Perfumes', image: perfume, filterValue: 'Perfume' },
        { name: 'Wallet', image: wallet, filterValue: 'Wallet' }
    ];

    const featuredSections = [
        { image: maninsuit, title: 'New Arrivals', buttonText: 'Shop the latest' },
        { image: maninwinter, title: 'Best - Sellers', buttonText: 'Shop Your Favourites' },
        { image: maninsweater, title: 'The Holiday Outfit', buttonText: 'Shop Occasion' }
    ];

    const features = [
        { icon: PiPackage, title: 'Complimentary Shipping', description: 'Enjoy the shipping to your doors' },
        { icon: PiRecycleThin, title: 'Consciously Crafted', description: 'Designed for you' },
        { icon: CiLocationOn, title: 'Come Say Hi', description: 'Visit our store' }
    ];

    return (
        <div className="overflow-hidden">
            {/* Hero Section */}
            <div className="w-full h-full relative group">
                <video
                    autoPlay
                    muted
                    playsInline
                    loop
                    className="w-full transition-transform duration-1000 group-hover:scale-105"
                >
                    <source src='https://m.media-amazon.com/images/S/al-eu-726f4d26-7fdb/8efe297b-b78d-4a43-954a-8b8fbc2ab804.mp4/productVideoOptimized.mp4' type="video/mp4" />
                </video>
                <div className={`w-[230px] h-[150px] flex flex-col gap-2 lg:gap-5 absolute top-8 left-5 lg:w-[800px] lg:h-[400px] lg:top-70 lg:left-25 transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
                    <div className={`text-white text-3xl font-bold text-shadow-stone-950 lg:text-6xl transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                        Your Cozy Era
                    </div>
                    <div className={`text-white text-shadow-stone-950 lg:text-3xl transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                        Get peak comfy check <br />
                        with new winter essentials.
                    </div>
                    <button onClick={()=>navigate('/products')} className={`w-[120px] h-[40px] cursor-pointer bg-white rounded-2xl font-semibold shadow-2xl lg:w-[250px] lg:h-[45px] lg:text-2xl text-yellow-500 transition-all duration-1000 delay-700 hover:scale-110 hover:shadow-xl hover:bg-yellow-50 active:scale-95 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                        SHOP NOW
                    </button>
                </div>
            </div>

            {/* Shop By Category Section */}
            <div className="flex mt-5 flex-col items-center">
                <div className={`text-2xl text-shadow-black transition-all duration-800 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                    Shop By Category
                </div>
                <div className="lg:flex lg:gap-4">
                    {categoryData.map((category, index) => (
                        <Link
                            key={category.name}
                            to="/products"
                            onClick={() =>
                                dispatch(
                                    updateFilter({
                                        type: "categories",
                                        value: category.filterValue,
                                        checked: true,
                                    })
                                )
                            }
                            className={`mt-4 cursor-pointer hover:scale-105 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
                            style={{ transitionDelay: `${900 + index * 150}ms` }}
                        >
                            <div className="w-[65vw] bg-yellow-500 rounded-3xl flex justify-center items-center h-[80vw] lg:h-[30vh] lg:w-[11vw] shadow-2xl overflow-hidden group">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-[60vw] h-[75vw] lg:h-[28vh] lg:w-[10vw] rounded-3xl transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                            <div className="flex justify-center mt-2 text-xl text-slate-700 transition-colors duration-300 hover:text-yellow-600">
                                {category.name}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Featured Sections with three pics */}
            <div className="mt-5 flex flex-col lg:flex-row gap-5 lg:justify-center">
                {featuredSections.map((section, index) => (
                    <div
                        key={index}
                        className={`flex justify-center rounded-3xl relative group overflow-hidden transition-all duration-700 hover:scale-105 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
                        style={{ transitionDelay: `${1400 + index * 200}ms` }}
                    >
                        <img
                            src={section.image}
                            className="w-[90vw] lg:w-[30vw] rounded-3xl shadow-2xl transition-transform duration-700 group-hover:scale-110"
                            alt="featured section"
                        />
                        <div className="absolute h-[20vh] w-[80vw] top-[40%] lg:w-[25vw] flex flex-col items-center transform transition-all duration-500 group-hover:-translate-y-2">
                            <h2 className="text-3xl text-white transition-all duration-300 group-hover:text-yellow-200">
                                {section.title}
                            </h2>
                            <button className="w-[50vw] lg:w-[15vw] h-[7vh] mt-2 rounded-full text-xl bg-white transition-all duration-300 hover:bg-yellow-500 hover:text-white hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl">
                                {section.buttonText}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Learn More Section */}
            <div className={`flex justify-center my-5 relative group transition-all duration-800 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`} style={{ transitionDelay: '2000ms' }}>
                <img
                    src={forest}
                    className="w-[95vw] h-[40vh] rounded-lg transition-transform duration-700 group-hover:scale-105"
                    alt="learn more pic"
                />
                <div className="absolute w-[90vw] h-[35vh] pl-2 top-5 flex flex-col items-center justify-center gap-3 transition-all duration-500 group-hover:-translate-y-2">
                    <div className="text-white text-3xl font-semibold justify-center transition-all duration-300 group-hover:text-yellow-200">
                        We are on a mission to clean up the industry
                    </div>
                    <div className="text-white text-2xl transition-all duration-300 group-hover:text-yellow-100">
                        Read about us
                    </div>
                    <button
                        onClick={() => navigate('/about')}
                        className="w-[70vw] lg:w-[15vw] h-[7vh] mt-2 rounded-full text-xl bg-white transition-all duration-300 hover:bg-yellow-500 hover:text-white hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                    >
                        Learn More
                    </button>
                </div>
            </div>

            {/* Features Section */}
            <div className="w-[100vw] flex flex-col items-center gap-5 justify-center my-5 lg:flex-row lg:gap-0 lg:my-10">
                {features.map((feature, index) => {
                    const IconComponent = feature.icon;
                    return (
                        <div
                            key={index}
                            className={`w-[90vw] flex flex-col items-center group cursor-pointer transition-all duration-700 hover:scale-105 hover:-translate-y-3 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
                            style={{ transitionDelay: `${2200 + index * 200}ms` }}
                        >
                            <div className="transition-all duration-500 group-hover:scale-110 group-hover:text-yellow-600">
                                <IconComponent size={100} />
                            </div>
                            <div className="text-2xl transition-colors duration-300 group-hover:text-yellow-600">
                                {feature.title}
                            </div>
                            <div className="transition-colors duration-300 group-hover:text-gray-600">
                                {feature.description}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Home;