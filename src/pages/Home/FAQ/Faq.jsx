import React from "react";
import { MdArrowOutward } from "react-icons/md";

const Faq = () => {
  return (
    <div className="w-10/12 mx-auto space-y-2">
      <div className="text-center mb-12">
        <h1 className="font-extrabold text-[40px] mt-6 mb-2">
          Frequently Asked Question (FAQ)
        </h1>
        <p className="opacity-50">
          Find quick answers to common questions about Zap-Shift's parcel
          delivery service. Learn how it works, delivery times, tracking
          options, <br /> and what to do in special situations.
        </p>
      </div>
      <div className="collapse collapse-arrow bg-base-100 border border-white">
        <input type="radio" name="my-accordion-2" defaultChecked />
        <div className="collapse-title font-semibold">
          What is Zap-Shift and how does it work?
        </div>
        <div className="collapse-content text-sm">
          Zap-Shift is a fast and reliable parcel delivery service that allows
          individuals and businesses to send and receive packages with ease.
          Simply book a delivery online, provide pickup and drop-off details,
          and our courier will handle the rest.
        </div>
      </div>

      <div className="collapse collapse-arrow bg-base-100 border border-white">
        <input type="radio" name="my-accordion-2" />
        <div className="collapse-title font-semibold">
          How long does it take for a parcel to be delivered?
        </div>
        <div className="collapse-content text-sm">
          We offer same-day, next-day, and standard delivery options. The
          delivery time depends on the service you select and the destination.
          Real-time tracking is available for all parcels.
        </div>
      </div>

      <div className="collapse collapse-arrow bg-base-100 border border-white">
        <input type="radio" name="my-accordion-2" />
        <div className="collapse-title font-semibold">
          Can I track my parcel in real time?
        </div>
        <div className="collapse-content text-sm">
          Yes! Once your parcel is dispatched, you’ll receive a tracking link
          via SMS or email so you can monitor your delivery in real time from
          pickup to drop-off.
        </div>
      </div>

      <div className="collapse collapse-arrow bg-base-100 border border-white">
        <input type="radio" name="my-accordion-2" />
        <div className="collapse-title font-semibold">
          What items are prohibited from being delivered through Zap-Shift?
        </div>
        <div className="collapse-content text-sm">
          For safety reasons, we do not allow the delivery of hazardous
          materials, illegal items, weapons, perishable goods, or valuables like
          cash or jewelry. Please refer to our prohibited items list for full
          details.
        </div>
      </div>

      <div className="collapse collapse-arrow bg-base-100 border border-white">
        <input type="radio" name="my-accordion-2" />
        <div className="collapse-title font-semibold">
          What should I do if my parcel is lost or damaged?
        </div>
        <div className="collapse-content text-sm">
          If your parcel is lost or arrives damaged, contact our support team
          immediately. We offer delivery protection and will investigate the
          issue to provide compensation where applicable.
        </div>
      </div>

      <div className="flex justify-center mt-8 items-center">
        <button className="btn text-black bg-[#CAEB66] rounded-xl font-bold">See More FAQ’s</button>
        <button className="btn w-12 h-12 bg-black text-[#CAEB66] rounded-full font-bold">
          <MdArrowOutward size={30}/>
        </button>
      </div>
    </div>
  );
};

export default Faq;
