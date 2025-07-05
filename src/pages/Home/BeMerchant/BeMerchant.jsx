import React from "react";
import image from '../../../assets/location-merchant.png'

const BeMerchant = () => {
  return (
    <div data-aos="flip-up" data-aos-duration="2000" className="bg-[#03373D] bg-[url('assets/be-a-merchant-bg.png')] bg-no-repeat rounded-4xl p-20">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <img
          src={image}
          className="w-auto rounded-lg mb-4"
        />
        <div>
          <h1 className="text-5xl font-bold">
            Merchant and Customer Satisfaction is Our First Priority
          </h1>
          <p className="py-6 opacity-50">
            We offer the lowest delivery charge with the highest value along
            with 100% safety of your product. Pathao courier delivers your
            parcels in every corner of Bangladesh right on time.
          </p>
          <div className="flex flex-col md:flex-row gap-2">
            <button className="btn bg-[#CAEB66] text-black rounded-full">
              Become a Merchant
            </button>
            <button className="btn btn-outline rounded-full text-[#CAEB66]">
              Earn with Zap Courier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeMerchant;
