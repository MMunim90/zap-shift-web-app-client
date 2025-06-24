import React from "react";
import Marquee from "react-fast-marquee";

import logo1 from "../../../assets/brands/logo1.png";
import logo2 from "../../../assets/brands/logo2.png";
import logo3 from "../../../assets/brands/logo3.png";
import logo4 from "../../../assets/brands/logo4.png";
import logo5 from "../../../assets/brands/logo5.png";
import logo6 from "../../../assets/brands/logo6.png";
import logo7 from "../../../assets/brands/logo7.png";

const logos = [logo1, logo2, logo3, logo4, logo5, logo6, logo7];

const ClientCarousel = () => {
  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold text-center text-white mb-8">
        We've helped thousands of sales teams
      </h2>
      <Marquee
        gradient={false}
        speed={50}
        pauseOnHover={true}
        className="py-4"
      >
        {logos.map((logo, index) => (
          <div key={index} className="mx-24">
            <img
              src={logo}
              alt={`Client logo ${index + 1}`}
              className="h-auto w-auto object-contain"
            />
          </div>
        ))}
      </Marquee>
    </section>
  );
};

export default ClientCarousel;
