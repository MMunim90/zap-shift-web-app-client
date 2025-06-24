import React from "react";

import imgSrc1 from '../../../assets/live-tracking.png'
import imgSrc2 from '../../../assets/tiny-deliveryman.png'
import imgSrc3 from '../../../assets/safe-delivery.png'

const features = [
  {
    title: "Live Parcel Tracking",
    description:
      "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment's journey and get instant status updates for complete peace of mind.",
    imgAlt: "Live Parcel Tracking Illustration",
    imgSrc: imgSrc1, 
  },
  {
    title: "100% Safe Delivery",
    description:
      "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.",
    imgAlt: "Safe Delivery Illustration",
    imgSrc: imgSrc2, 
  },
  {
    title: "24/7 Call Center Support",
    description:
      "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.",
    imgAlt: "Call Center Support Illustration",
    imgSrc: imgSrc3, 
  },
];

const DeliveryFeatures = () => {
  return (
    <section className="py-16 px-4 md:px-8 border-y-2 border-dashed border-gray-300">
      <div className="max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row items-center rounded-xl p-6 md:p-8 gap-6"
          >
            <div className="w-full md:w-1/5">
              <img
                src={feature.imgSrc}
                alt={feature.imgAlt}
                className="w-full h-[200px] object-contain p-6 bg-white rounded-4xl"
              />
            </div>
            <div className="hidden md:block h-32 border-l-2 border-dashed border-white mx-6"></div>

            <div className="w-full md:w-2/3">
              <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-white text-sm md:text-base">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DeliveryFeatures;
