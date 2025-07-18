import React from "react";
import heroimage from "../assets/images/abouthero.jpeg";
import happycustomer from "../assets/images/happycustomer.jpg";
import image1 from "../assets/images/image1about.webp";
import fashionableimage from "../assets/images/fashionableimage.jpeg";
import ourproducts from "../assets/images/ourproducts.jpg"
import ourstores from "../assets/images/ourstores.png"
import ourfashion from "../assets/images/ourfashion.webp"

const AboutUs = () => {
  return (
    <div>
      {/* hero section */}
      <div className="w-[100vw] relative">
        <img src={heroimage} className="w-[100vw]" alt="" />
        <div className="absolute top-0 lg:top-[25vh] w-[100vw] text-[#ecba49] flex flex-col items-center py-5">
          <div className="text-xl lg:text-8xl w-[33vw] lg:w-[30vw] text-center">
            We believe we can all make <br /> a difference
          </div>
          <div className="w-[80vw] mt-3 text-sm lg:text-4xl lg:mt-8 text-center">
            Our way: Exceptional Quality. <br />
            Ethical Factories. Radical Transparency.
          </div>
        </div>
      </div>

      {/* content message */}
      <div className="w-[full] h-[50vh] flex justify-center items-center lg:my-5">
        <div className="w-[80vw] h-[40vh] p-3 text-center   rounded-2xl lg:text-3xl lg:w-[60vw] ">
          UKF Outfits is a fashion-forward <br className="lg:hidden" />
          e-commerce destination offering timeless style with modern flair. We
          curate premium clothing that blends quality, elegance, and
          individuality empowering you to express yourself with confidence.
          Discover versatile pieces crafted to elevate every occasion, because
          fashion should feel as good as it looks.
        </div>
      </div>

      {/* happy customer section */}
      <div className="w-[100vw] flex flex-col lg:flex-row lg:justify-around lg:my-16">
        <div>
          <img src={happycustomer}  alt="customer image" />
        </div>
        <div className=" h-[54vh] flex justify-center items-center">
          <div className=" lg:w-[50vw] h-[40vh] lg:h-[80vh] lg:flex lg:flex-col lg:justify-center lg:pt-[30vh] ">
            <div className="text-3xl lg:text-4xl text-center mb-5 font-semibold">
              Our Ethical Approach
            </div>
            <div className="text-center">
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

      {/* image 1 */}
      <div className="w-[100vw] lg:my-12">
        <img src={image1} alt="image1" />
      </div>

      {/* fashionable clothing */}
      <div className="w-[100vw] flex flex-col lg:flex-row lg:justify-around lg:my-16 ">
        <div className="w-[100vw] lg:w-[50vw] h-[54vh] flex justify-center items-center">
          <div className="w-[90vw] lg:w-[50vw] h-[45vh] lg:flex lg:flex-col lg:justify-center lg:pt-[35vh] ">
            <div className="text-3xl lg:text-4xl mb-5 text-center font-semibold">
              Fashionable Clothing
            </div>
            <div className="text-center">
              Fashionable clothing at UKF Outfits is an embodiment of
              sophistication, individuality, and modern elegance. Every piece is
              thoughtfully curated to celebrate self-expression blending
              timeless silhouettes with trend-savvy design. We believe fashion
              should be empowering, not just stylish, which is why UKF brings
              garments that complement your personality and elevate your
              lifestyle. It’s not just fashion it’s your signature look,
              delivered.
            </div>
          </div>
        </div>

        <div>
          <img src={fashionableimage} className="lg:w-[35vw]" alt="customer image" />
        </div>
      </div>

      {/* More to explore */}
      <div className="flex flex-col w-[100vw] items-center my-5">
        <div className="text-3xl font-semibold">
            More To Explore
        </div>
        <div className="flex flex-col lg:flex-row gap-5  lg:gap-10 my-5">
            <div className="flex flex-col items-center gap-2">
                <img src={ourproducts} className="w-[90vw] lg:w-[27vw] rounded-2xl shadow-2xl" alt="our products" />
                <div className="text-xl font-semibold">Our Products</div>
            </div>
            <div className="flex flex-col items-center gap-2">
                <img src={ourstores} className="w-[90vw] lg:w-[27vw] rounded-2xl shadow-2xl" alt="" />
                <div className="text-xl font-semibold">Our Stores</div>
            </div>
            <div className="flex flex-col items-center gap-2">
                <img src={ourfashion} className="w-[90vw] lg:w-[27vw] rounded-2xl shadow-2xl" alt="" />
                <div className="text-xl font-semibold">Our Fashion</div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
