import React from "react";

const ServicesCard = ({service}) => {
    const {Icon, title, description} = service
  return (
    <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:bg-[#CAEB66]">
      <div className="text-4xl text-[#03373D] mb-4 flex justify-center mx-auto"><Icon /></div>
      <h3 className="text-xl font-semibold mb-2 text-[#03373D]">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default ServicesCard;
