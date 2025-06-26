import React, { useState } from "react";
import image from "../../../assets/customer-top.png";
import TestimonialCard from "./TestimonialCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const testimonials = [
  {
    name: "Rasel Ahamed",
    role: "CTO, TechNova",
    text: "Zap-Shift’s delivery service is fast and dependable. We use it regularly for sending urgent documents and tech gear—always on time!",
  },
  {
    name: "Awlad Hossin",
    role: "Senior Product Designer, Creatix",
    text: "I was amazed at how quickly my package arrived. Zap-Shift is now my go-to for personal and office deliveries!",
  },
  {
    name: "Nasir Uddin",
    role: "CEO, Innoventures",
    text: "From booking to delivery, the whole process was seamless. Our business logistics have improved greatly since using Zap-Shift.",
  },
  {
    name: "Ayesha Sultana",
    role: "Marketing Manager, BrightMark",
    text: "Thanks to Zap-Shift, our promotional materials reach clients faster than ever. It’s truly a reliable delivery partner.",
  },
  {
    name: "Tanvir Hossain",
    role: "Software Engineer, Devline",
    text: "I sent a birthday gift to my sister across town and it arrived within hours. Super impressed with Zap-Shift’s speed!",
  },
  {
    name: "Nadia Rahman",
    role: "HR Executive, PeoplePro",
    text: "We use Zap-Shift for sending welcome kits to new hires. The quick and safe delivery helps make a great first impression.",
  },
  {
    name: "Jubayer Alam",
    role: "UX Researcher, Humanable",
    text: "Real-time tracking and smooth delivery—Zap-Shift sets a new standard in courier services. Highly recommended!",
  },
  {
    name: "Fatema Binte",
    role: "Sales Lead, NeoCorp",
    text: "Even during peak hours, Zap-Shift delivered our samples on time. A must-have service for every sales team.",
  },
  {
    name: "Hasibul Haque",
    role: "Operations Analyst, FlowTech",
    text: "Our team relies on Zap-Shift for sending daily operational materials. Their consistency and customer service are outstanding.",
  },
  {
    name: "Munira Jahan",
    role: "Business Consultant, StratEdge",
    text: "Clients often praise our timely document deliveries—all thanks to Zap-Shift. It’s a service we confidently recommend to others.",
  },
];

const CustomersMessages = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="py-8 px-4 relative">
      {/* Header */}
      <div className="text-center mb-12 flex flex-col items-center">
        <img className="w-[244px]" src={image} alt="Customer header" />
        <h1 className="font-extrabold text-[40px] mt-6 mb-2">
          What our customers are saying
        </h1>
        <p className="opacity-50">
          Our customers love Zap-Shift for its speed, reliability, and friendly
          service. Read real experiences from users who trust us to <br />
          deliver their parcels safely and on time.
        </p>
      </div>

      {/* Swiper + Controls */}
      <div className="relative">
        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          loop={true}
          slidesPerView={3}
          coverflowEffect={{
            rotate: 10,
            stretch: 20,
            depth: 100,
            modifier: 2.5,
          }}
          pagination={{ el: ".swiper-pagination", clickable: true }}
          navigation={{
            nextEl: ".custom-swiper-next",
            prevEl: ".custom-swiper-prev",
          }}
          modules={[EffectCoverflow, Pagination, Navigation]}
          className="swiper_container"
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)} // track active slide
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide
              key={index}
              style={{
                opacity: index === activeIndex ? 1 : 0.6,
                transition: "opacity 0.3s ease",
              }}
            >
              <TestimonialCard testimonial={testimonial} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Arrows + Pagination Centered */}
        <div className="mt-12 lg:flex justify-around items-center gap-6 sm:gap-10 hidden max-w-[400px] mx-auto">
          {/* Left Arrow */}
          <div className="custom-swiper-prev bg-[#CAEB66] text-black p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-100 transition-all duration-300">
            <FaChevronLeft size={25} />
          </div>

          {/* Pagination in between - flex-grow to center */}
          <div className="swiper-pagination flex-grow flex justify-center mb-2"></div>

          {/* Right Arrow */}
          <div className="custom-swiper-next bg-[#CAEB66] text-black p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-100 transition-all duration-300">
            <FaChevronRight size={25} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomersMessages;
