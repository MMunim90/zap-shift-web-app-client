import React, { useRef, useState, useEffect } from "react";
import { FiArrowDownLeft } from "react-icons/fi";
import { MdArrowOutward } from "react-icons/md";

const Faq = () => {
  const [showAll, setShowAll] = useState(false);
  const [animate, setAnimate] = useState(false);
  const faqSectionRef = useRef(null);

  // Handle fade-in animation on show/hide
  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 400);
    return () => clearTimeout(timer);
  }, [showAll]);

  const handleSeeMore = () => {
    setShowAll(true);
    setTimeout(() => {
      faqSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleShowLess = () => {
    setShowAll(false);
    setTimeout(() => {
      faqSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const faqs = [
    {
      question: "What is Zap-Shift and how does it work?",
      answer:
        "Zap-Shift is a fast and reliable parcel delivery service that allows individuals and businesses to send and receive packages with ease. Simply book a delivery online, provide pickup and drop-off details, and our courier will handle the rest.",
    },
    {
      question: "How long does it take for a parcel to be delivered?",
      answer:
        "We offer same-day, next-day, and standard delivery options. The delivery time depends on the service you select and the destination. Real-time tracking is available for all parcels.",
    },
    {
      question: "Can I track my parcel in real time?",
      answer:
        "Yes! Once your parcel is dispatched, you’ll receive a tracking link via SMS or email so you can monitor your delivery in real time from pickup to drop-off.",
    },
    {
      question:
        "What items are prohibited from being delivered through Zap-Shift?",
      answer:
        "For safety reasons, we do not allow the delivery of hazardous materials, illegal items, weapons, perishable goods, or valuables like cash or jewelry. Please refer to our prohibited items list for full details.",
    },
    {
      question: "What should I do if my parcel is lost or damaged?",
      answer:
        "If your parcel is lost or arrives damaged, contact our support team immediately. We offer delivery protection and will investigate the issue to provide compensation where applicable.",
    },
    {
      question: "How can I schedule a pickup?",
      answer:
        "You can schedule a pickup by logging into your Zap-Shift account and selecting a time slot that works for you.",
    },
    {
      question: "Does Zap-Shift offer business delivery solutions?",
      answer:
        "Yes, we offer business accounts with tailored logistics and reporting tools. Contact our sales team for enterprise solutions.",
    },
    {
      question: "Can I cancel or reschedule a delivery?",
      answer:
        "Yes. You can cancel or reschedule a delivery up to 1 hour before pickup time through your dashboard or by contacting support.",
    },
    {
      question: "How can I change the delivery address after booking?",
      answer:
        "To change your delivery address after booking, contact our customer support as soon as possible. Address changes may be subject to availability and could affect delivery time or fees.",
    },
  ];

  const visibleFaqs = showAll ? faqs : faqs.slice(0, 4);

  return (
    <div
      ref={faqSectionRef}
      className={`w-10/12 mx-auto space-y-2 transition-all duration-500 ${
        animate ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
      }`}
    >
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

      {visibleFaqs.map((faq, idx) => (
        <div
          key={idx}
          className="collapse collapse-arrow bg-base-100 border border-white"
        >
          <input
            type="radio"
            name="faq-accordion"
            defaultChecked={idx === 0}
          />
          <div className="collapse-title font-semibold">{faq.question}</div>
          <div className="collapse-content text-sm">{faq.answer}</div>
        </div>
      ))}

      {!showAll ? (
        <div className="flex justify-center mt-8 items-center">
          <button
            className="btn text-black bg-[#CAEB66] rounded-xl font-bold"
            onClick={handleSeeMore}
          >
            See More FAQ’s
          </button>
          <button className="w-11 h-11 bg-black text-[#CAEB66] rounded-full font-bold">
            <FiArrowDownLeft className="mx-auto" size={30} />
          </button>
        </div>
      ) : (
        <div className="flex justify-center mt-8">
          <button
            className="btn text-black bg-[#CAEB66] rounded-xl font-bold"
            onClick={handleShowLess}
          >
            See Less
          </button>
          <button className="w-11 h-11 bg-black text-[#CAEB66] rounded-full font-bold">
            <MdArrowOutward className="mx-auto" size={30} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Faq;
