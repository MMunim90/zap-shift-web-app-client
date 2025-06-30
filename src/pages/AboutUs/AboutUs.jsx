import React from "react";
import { FaShippingFast, FaPeopleCarry, FaGlobeAsia } from "react-icons/fa";
import { MdSupportAgent } from "react-icons/md";

const AboutUs = () => {
  return (
    <div className="px-6 py-12 max-w-7xl mx-auto text-white">
      <h2 className="text-4xl font-bold text-center mb-4 text-[#CAEB66]">About Zap-Shift</h2>
      <p className="text-center text-lg text-gray-200 max-w-3xl mx-auto mb-10">
        Zap-Shift is a tech-driven parcel delivery platform built to simplify your delivery
        experience. Whether you're sending documents or bulky items, we ensure fast, secure, and
        reliable deliveries across Bangladesh.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        <div className="p-6 border border-white rounded-xl shadow hover:shadow-md transition">
          <FaShippingFast className="text-4xl text-[#CAEB66] mb-3 mx-auto" />
          <h4 className="text-xl font-semibold mb-2">Fast Delivery</h4>
          <p className="text-sm text-gray-300">
            We ensure quick pickups and timely parcel drops at every destination.
          </p>
        </div>

        <div className="p-6 border border-white rounded-xl shadow hover:shadow-md transition">
          <FaPeopleCarry className="text-4xl text-[#CAEB66] mb-3 mx-auto" />
          <h4 className="text-xl font-semibold mb-2">Reliable Network</h4>
          <p className="text-sm text-gray-300">
            Our extensive warehouse and delivery coverage span all 64 districts.
          </p>
        </div>

        <div className="p-6 border border-white rounded-xl shadow hover:shadow-md transition">
          <MdSupportAgent className="text-4xl text-[#CAEB66] mb-3 mx-auto" />
          <h4 className="text-xl font-semibold mb-2">24/7 Support</h4>
          <p className="text-sm text-gray-300">
            Our customer support team is always ready to assist with any query or issue.
          </p>
        </div>

        <div className="p-6 border border-white rounded-xl shadow hover:shadow-md transition">
          <FaGlobeAsia className="text-4xl text-[#CAEB66] mb-3 mx-auto" />
          <h4 className="text-xl font-semibold mb-2">Smart Platform</h4>
          <p className="text-sm text-gray-300">
            Book, track, and manage your deliveries seamlessly through our modern web interface.
          </p>
        </div>
      </div>

      <div className="mt-16 text-center max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold mb-2">Our Mission</h3>
        <p className="text-gray-200 text-base">
          At Zap-Shift, our mission is to redefine parcel delivery in Bangladesh with smart logistics,
          transparent pricing, and unmatched customer experience. We aim to empower individuals and
          businesses to ship with speed and confidence.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;