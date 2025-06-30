import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useNavigate } from "react-router";

const generateTrackingId = () => {
  const prefix = "PCL";
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `${prefix}-${randomPart}-${timestamp}`;
};

const SendParcel = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [uniqueRegions, setUniqueRegions] = useState([]);
  const [senderAreas, setSenderAreas] = useState([]);
  const [receiverAreas, setReceiverAreas] = useState([]);
  const [formData, setFormData] = useState(null);
  const [cost, setCost] = useState(0);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const senderRegion = watch("senderRegion");
  const receiverRegion = watch("receiverRegion");
  const parcelType = watch("type");

  useEffect(() => {
    fetch("/warehouses.json")
      .then((res) => res.json())
      .then((data) => {
        setWarehouses(data);
        const regions = [...new Set(data.map((w) => w.region))];
        setUniqueRegions(regions);
      });
  }, []);

  useEffect(() => {
    const matched = warehouses.filter((w) => w.region === senderRegion);
    const areas = matched.flatMap((w) => w.covered_area);
    setSenderAreas(areas);
  }, [senderRegion, warehouses]);

  useEffect(() => {
    const matched = warehouses.filter((w) => w.region === receiverRegion);
    const areas = matched.flatMap((w) => w.covered_area);
    setReceiverAreas(areas);
  }, [receiverRegion, warehouses]);

  const onSubmit = (data) => {
    const weight = parseFloat(data.weight) || 0;
    const sameArea = data.senderArea === data.receiverArea;

    let baseCost = 0;
    let extraCost = 0;
    let total = 0;
    let breakdown = "";

    if (data.type === "document") {
      baseCost = sameArea ? 60 : 80;
      breakdown = `Base Cost (Document): ৳${baseCost}`;
      total = baseCost;
    } else {
      if (weight <= 3) {
        baseCost = sameArea ? 110 : 150;
        breakdown = `Base Cost (Non-Doc ≤ 3kg): ৳${baseCost}`;
        total = baseCost;
      } else {
        const extraKg = weight - 3;
        extraCost = extraKg * 40;
        baseCost = sameArea ? 110 : 150;
        const extraOutside = sameArea ? 0 : 40;
        breakdown = `
        Base Cost (Non-Doc > 3kg): ৳${baseCost}<br/>
        Extra Weight Charge (৳40/kg × ${extraKg.toFixed(
          1
        )}kg): ৳${extraCost}<br/>
        ${!sameArea ? "Outside District Extra: ৳40<br/>" : ""}
      `;
        total = baseCost + extraCost + (sameArea ? 0 : 40);
      }
    }

    setCost(total);
    setFormData(data);

    Swal.fire({
      title: "Confirm Delivery Charges",
      html: `
    <div class="text-left text-base leading-relaxed">
      <p><strong>Parcel Type:</strong> ${
        data.type === "document" ? "Document" : "Non-Document"
      }</p>
      ${
        data.type === "non-document"
          ? `<p><strong>Weight:</strong> ${weight} kg (${
              weight > 3 ? "Above 3kg" : "3kg or less"
            })</p>`
          : ""
      }
      <p><strong>Delivery:</strong> ${
        sameArea ? "Within Same District" : "Outside District"
      }</p>
      <hr class="my-2"/>
      <p><strong>Base Charge:</strong> ৳${baseCost}</p>
      ${
        data.type === "non-document" && weight > 3
          ? `
            <p><strong>Extra Weight Charge:</strong> ৳${extraCost}</p>
            <p class="text-sm text-gray-500 ml-1">৳40 × ${(weight - 3).toFixed(
              1
            )}kg for weight over 3kg</p>
          `
          : ""
      }
      ${
        data.type === "non-document" && weight > 3 && !sameArea
          ? `
            <p><strong>Outside District Extra:</strong> ৳40</p>
            <p class="text-sm text-gray-500 ml-1">Extra charge applies when destination is outside sender's district</p>
          `
          : ""
      }
      <hr class="my-2"/>
      <p class="text-lg font-semibold">
        Total Delivery Cost: <span class="text-green-600 text-xl">৳${total}</span>
      </p>
    </div>
  `,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#CAEB66",
      confirmButtonText: "✅ Proceed to Payment",
      cancelButtonText: "✏️ Edit Parcel Info",
      customClass: {
        confirmButton: "text-black px-4 py-2 rounded",
        cancelButton:
          "bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded ml-2",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        handleConfirm();
      }
    });
  };

  const handleConfirm = () => {
    const savedData = {
      ...formData,
      email: user?.email || "unknown",
      creation_date: dayjs().toISOString(), // ISO 8601 format
      status: "pending",
      tracking_id: generateTrackingId(),
      payment_status: "unpaid",
      delivery_status: "not_collected",
      isPaid: false,
      total_cost: cost,
    };

    console.log("Saving to DB:", savedData);

    axiosSecure.post("/parcels", savedData).then((res) => {
      console.log(res.data);
      if (res.data.insertedId) {
        Swal.fire({
          title: "🎉 Parcel Booked Successfully!",
          html: `
        <div class="text-left text-base leading-relaxed">
          <p><strong>Parcel Title:</strong> ${savedData.title}</p>
          <p><strong>Type:</strong> ${savedData.type}</p>
          <p><strong>Email:</strong> ${savedData.email}</p>
          <p><strong>Created On:</strong> ${dayjs(
            savedData.creation_date
          ).format("YYYY-MM-DD HH:mm:ss")}</p>
          <hr class="my-2"/>
          <p class="text-lg font-semibold">
            Total Delivery Cost: <span class="text-green-600 text-xl">৳${cost}</span>
          </p>
        </div>
      `,
          icon: "success",
          showCancelButton: true,
          confirmButtonColor: "#CAEB66",
          confirmButtonText: "🎯 Done",
          cancelButtonText: "💳 Go to Payment",
          customClass: {
            confirmButton: "text-black px-4 py-2 rounded",
            cancelButton:
              "bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ml-2",
          },
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.cancel) {
            navigate(`/dashboard/payment/${res.data.insertedId}`);
            return;
          }

          if (result.isDismissed || result.isConfirmed) {
            return;
          }
        });
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-1">Add Parcel</h2>
      <p className="text-gray-600 mb-6">
        Fill out the form below to send your parcel
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Parcel Info */}
        <div className="border p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Parcel Info</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label mb-1">Type</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="document"
                    {...register("type", { required: true })}
                    className="radio text-[#CAEB66]"
                  />
                  Document
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="non-document"
                    {...register("type", { required: true })}
                    className="radio text-[#CAEB66]"
                  />
                  Non-Document
                </label>
              </div>
              {errors.type && (
                <p className="text-red-500">Parcel type is required.</p>
              )}
            </div>

            <div>
              <div className="mb-4">
                <label className="label">Parcel Title</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  {...register("title", { required: true })}
                />
                {errors.title && (
                  <p className="text-red-500">Title is required.</p>
                )}
              </div>
              <div>
                <label className="label">Parcel Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  className="input input-bordered w-full"
                  {...register("weight", {
                    validate: (value) => {
                      if (parcelType === "non-document") {
                        if (!value)
                          return "Weight is required for non-document parcels.";
                        if (value > 100)
                          return "Maximum allowed weight is 100 kg.";
                      }
                      return true;
                    },
                  })}
                  disabled={parcelType !== "non-document"}
                />
                {parcelType !== "non-document" && (
                  <p className="text-sm text-gray-500">
                    Weight only required for non-document parcels.
                  </p>
                )}
                {errors.weight && (
                  <p className="text-red-500 text-sm">
                    {errors.weight.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sender & Receiver Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sender Info */}
          <div className="border p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Sender Info</h3>
            <div className="space-y-4">
              <div>
                <label className="label">Name</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  {...register("senderName", { required: true })}
                />
              </div>
              <div>
                <label className="label">Contact</label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  {...register("senderContact", {
                    required: "Contact number is required",
                    validate: (value) =>
                      /^\d{11}$/.test(value) ||
                      "Contact number must be 11 digits",
                  })}
                />
                {errors.senderContact && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.senderContact.message}
                  </p>
                )}
              </div>

              <div>
                <label className="label">Region</label>
                <select
                  className="select select-bordered w-full"
                  {...register("senderRegion", { required: true })}
                >
                  <option value="">Select Region</option>
                  {uniqueRegions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Pickup Wire house</label>
                <select
                  className="select select-bordered w-full"
                  {...register("senderArea", { required: true })}
                >
                  <option value="">Select Area</option>
                  {senderAreas.map((area, idx) => (
                    <option key={idx} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Address</label>
                <textarea
                  className="textarea textarea-bordered w-full"
                  {...register("senderAddress", { required: true })}
                />
              </div>
              <div>
                <label className="label">Pickup Instruction</label>
                <textarea
                  className="textarea textarea-bordered w-full"
                  {...register("pickupInstruction", { required: true })}
                />
              </div>
            </div>
          </div>

          {/* Receiver Info */}
          <div className="border p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Receiver Info</h3>
            <div className="space-y-4">
              <div>
                <label className="label">Name</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  {...register("receiverName", { required: true })}
                />
              </div>

              <div>
                <label className="label">Contact</label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  {...register("receiverContact", {
                    required: "Contact number is required",
                    validate: (value) =>
                      /^\d{11}$/.test(value) ||
                      "Contact number must be 11 digits",
                  })}
                />
                {errors.receiverContact && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.receiverContact.message}
                  </p>
                )}
              </div>

              <div>
                <label className="label">Region</label>
                <select
                  className="select select-bordered w-full"
                  {...register("receiverRegion", { required: true })}
                >
                  <option value="">Select Region</option>
                  {uniqueRegions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Delivery Wire house</label>
                <select
                  className="select select-bordered w-full"
                  {...register("receiverArea", { required: true })}
                >
                  <option value="">Select Area</option>
                  {receiverAreas.map((area, idx) => (
                    <option key={idx} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Address</label>
                <textarea
                  className="textarea textarea-bordered w-full"
                  {...register("receiverAddress", { required: true })}
                />
              </div>
              <div>
                <label className="label">Delivery Instruction</label>
                <textarea
                  className="textarea textarea-bordered w-full"
                  {...register("deliveryInstruction", { required: true })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="text-left">
          <button className="btn bg-[#CAEB66] text-black mt-6" type="submit">
            Proceed to Confirm Booking
          </button>
        </div>
      </form>
    </div>
  );
};

export default SendParcel;
