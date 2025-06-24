import React from "react";
import {
  FaTruckPickup,
  FaMoneyBillWave,
  FaWarehouse,
  FaBuilding,
} from "react-icons/fa";

const steps = [
  {
    title: "Booking Pick & Drop",
    description:
      "Schedule pickups and drop-offs easily from your location with our fast and user-friendly booking system.",
    icon: FaTruckPickup,
  },
  {
    title: "Cash On Delivery",
    description:
      "Securely collect payments at the doorstep. We offer reliable COD service across the country.",
    icon: FaMoneyBillWave,
  },
  {
    title: "Delivery Hub",
    description:
      "Our local hubs ensure efficient sorting and dispatching, reducing delivery time and improving accuracy.",
    icon: FaWarehouse,
  },
  {
    title: "Booking SME & Corporate",
    description:
      "Dedicated solutions for SMEs and enterprises with contract logistics, tracking, and bulk order handling.",
    icon: FaBuilding,
  },
];

const HowItWorks = () => {
  return (
    <section className="py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">How it Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className="text-3xl text-teal-700 mb-4">
                <step.icon />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </div>
          ))}

          <div className="hidden lg:block absolute left-1/2 top-0 h-full border-l-2 border-dashed border-blue-200 transform -translate-x-1/2"></div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
