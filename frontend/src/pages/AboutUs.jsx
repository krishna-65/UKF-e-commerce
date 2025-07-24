import React, { useState, useEffect, useRef } from "react";
import heroimage from "../assets/images/abouthero.jpeg";
import happycustomer from "../assets/images/happycustomer.jpg";
import image1 from "../assets/images/image1about.webp";
import fashionableimage from "../assets/images/fashionableimage.jpeg";
import ourproducts from "../assets/images/ourproducts.jpg";
import ourstores from "../assets/images/ourstores.png";
import ourfashion from "../assets/images/ourfashion.webp";

const AboutUs = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleSections, setVisibleSections] = useState({});
  const sectionRefs = useRef({});

  useEffect(() => {
    // Initial hero animation
    setTimeout(() => setIsVisible(true), 100);

    // Intersection Observer for scroll-triggered animations
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSections(prev => ({
            ...prev,
            [entry.target.dataset.section]: true
          }));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: '50px'
    });

    // Observe all sections
    Object.values(sectionRefs.current).forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const setSectionRef = (section) => (el) => {
    sectionRefs.current[section] = el;
  };

  const exploreItems = [
    { image: ourproducts, title: "Our Products" },
    { image: ourstores, title: "Our Stores" },
    { image: ourfashion, title: "Our Fashion" }
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <div className="w-[100vw] relative group">
        <img 
          src={heroimage} 
          className="w-[100vw] transition-transform duration-1000 group-hover:scale-105" 
          alt="hero" 
        />
        <div className="absolute top-0 lg:top-[25vh] w-[100vw] text-[#ecba49] flex flex-col items-center py-5">
          <div className={`text-xl lg:text-8xl w-[33vw] lg:w-[30vw] text-center transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            We believe we can all make <br /> a difference
          </div>
          <div className={`w-[80vw] mt-3 text-sm lg:text-4xl lg:mt-8 text-center transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            Our way: Exceptional Quality. <br />
            Ethical Factories. Radical Transparency.
          </div>
        </div>
      </div>

      {/* Content Message */}
      <div 
        ref={setSectionRef('message')}
        data-section="message"
        className="w-[full] h-[50vh] flex justify-center items-center lg:my-5"
      >
        <div className={`w-[80vw] h-[40vh] p-3 text-center rounded-2xl lg:text-3xl lg:w-[60vw] transition-all duration-800 hover:scale-105 hover:shadow-lg ${visibleSections.message ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          UKF Outfits is a fashion-forward <br className="lg:hidden" />
          e-commerce destination offering timeless style with modern flair. We
          curate premium clothing that blends quality, elegance, and
          individuality empowering you to express yourself with confidence.
          Discover versatile pieces crafted to elevate every occasion, because
          fashion should feel as good as it looks.
        </div>
      </div>

      {/* Happy Customer Section */}
      <div 
        ref={setSectionRef('ethical')}
        data-section="ethical"
        className="w-[100vw] flex flex-col lg:flex-row lg:justify-around lg:my-16"
      >
        <div className={`transition-all duration-800 hover:scale-105 ${visibleSections.ethical ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`}>
          <img 
            src={happycustomer} 
            className="transition-transform duration-500 hover:scale-110 rounded-lg shadow-lg hover:shadow-2xl" 
            alt="customer image" 
          />
        </div>
        <div className="h-[54vh] flex justify-center items-center">
          <div className={`lg:w-[50vw] h-[40vh] lg:h-[80vh] lg:flex lg:flex-col lg:justify-center lg:pt-[30vh] transition-all duration-800 delay-300 ${visibleSections.ethical ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}`}>
            <div className="text-3xl lg:text-4xl text-center mb-5 font-semibold transition-colors duration-300 hover:text-[#ecba49]">
              Our Ethical Approach
            </div>
            <div className="text-center leading-relaxed hover:text-gray-700 transition-colors duration-300">
              At UKF Outfits, our ethical approach is woven into every thread of
              our brand. We prioritize sustainable sourcing, fair labor
              practices, and mindful production that respects both people and
              the planet. By embracing transparency and responsibility, we
              ensure that fashion is not only beautiful but also conscientious.
              Because style should never come at the cost of integrity.
            </div>
          </div>
        </div>
      </div>

      {/* Image 1 */}
      <div 
        ref={setSectionRef('image1')}
        data-section="image1"
        className="w-[100vw] lg:my-12 group"
      >
        <img 
          src={image1} 
          alt="image1" 
          className={`w-full transition-all duration-1000 group-hover:scale-105 ${visibleSections.image1 ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        />
      </div>

      {/* Fashionable Clothing */}
      <div 
        ref={setSectionRef('fashionable')}
        data-section="fashionable"
        className="w-[100vw] flex flex-col lg:flex-row lg:justify-around lg:my-16"
      >
        <div className="w-[100vw] lg:w-[50vw] h-[54vh] flex justify-center items-center">
          <div className={`w-[90vw] lg:w-[50vw] h-[45vh] lg:flex lg:flex-col lg:justify-center lg:pt-[35vh] transition-all duration-800 ${visibleSections.fashionable ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`}>
            <div className="text-3xl lg:text-4xl mb-5 text-center font-semibold transition-colors duration-300 hover:text-[#ecba49]">
              Fashionable Clothing
            </div>
            <div className="text-center leading-relaxed hover:text-gray-700 transition-colors duration-300">
              Fashionable clothing at UKF Outfits is an embodiment of
              sophistication, individuality, and modern elegance. Every piece is
              thoughtfully curated to celebrate self-expression blending
              timeless silhouettes with trend-savvy design. We believe fashion
              should be empowering, not just stylish, which is why UKF brings
              garments that complement your personality and elevate your
              lifestyle. It's not just fashion it's your signature look,
              delivered.
            </div>
          </div>
        </div>

        <div className={`transition-all duration-800 delay-300 hover:scale-105 ${visibleSections.fashionable ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}`}>
          <img 
            src={fashionableimage} 
            className="lg:w-[35vw] transition-transform duration-500 hover:scale-110 rounded-lg shadow-lg hover:shadow-2xl" 
            alt="fashionable clothing" 
          />
        </div>
      </div>

      {/* More to Explore */}
      <div 
        ref={setSectionRef('explore')}
        data-section="explore"
        className="flex flex-col w-[100vw] items-center my-5"
      >
        <div className={`text-3xl font-semibold mb-8 transition-all duration-800 hover:text-[#ecba49] ${visibleSections.explore ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          More To Explore
        </div>
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-10 my-5">
          {exploreItems.map((item, index) => (
            <div 
              key={index}
              className={`flex flex-col items-center gap-2 group cursor-pointer transition-all duration-700 hover:scale-105 hover:-translate-y-3 ${visibleSections.explore ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
              style={{ transitionDelay: `${300 + index * 200}ms` }}
            >
              <div className="overflow-hidden rounded-2xl shadow-2xl group-hover:shadow-3xl transition-shadow duration-500">
                <img 
                  src={item.image} 
                  className="w-[90vw] lg:w-[27vw] rounded-2xl transition-transform duration-700 group-hover:scale-110" 
                  alt={item.title.toLowerCase()} 
                />
              </div>
              <div className="text-xl font-semibold transition-all duration-300 group-hover:text-[#ecba49] group-hover:scale-110">
                {item.title}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Animation Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
        
        .float-animation:nth-child(2) {
          animation-delay: 1s;
        }
        
        .float-animation:nth-child(3) {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default AboutUs;