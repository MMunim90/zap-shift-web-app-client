import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import serviceCenters from "../../../public/warehouses.json";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import axios from "axios";

const BeARider = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [regions, setRegions] = useState([]);
  const [coveredAreas, setCoveredAreas] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");

  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    age: "",
    region: "",
    district: "",
    phone: "",
    nid: "",
    bikeBrand: "",
    bikeRegNumber: "",
    nidImage: "",
    bikeImage: "",
    additionalInfo: "",
    status: "pending",
  });

  useEffect(() => {
    const regionList = [
      ...new Set(serviceCenters.map((center) => center.region)),
    ];
    setRegions(regionList);
  }, []);

  useEffect(() => {
    if (selectedRegion) {
      // Find all covered areas for the selected region
      const areas = serviceCenters
        .filter((center) => center.region === selectedRegion)
        .flatMap((center) => center.covered_area);

      setCoveredAreas(areas);
    } else {
      setCoveredAreas([]);
    }
  }, [selectedRegion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "region") setSelectedRegion(value);
  };

  const handleImageUpload = async (e, field) => {
    const image = e.target.files[0];
    if (!image) return;

    const formDataUpload = new FormData();
    formDataUpload.append("image", image);

    try {
      Swal.fire({
        title: "Uploading...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${
        import.meta.env.VITE_image_upload_key
      }`;
      const res = await axios.post(imageUploadUrl, formDataUpload);

      const url = res.data.data.url;

      setFormData((prev) => ({
        ...prev,
        [field]: url,
      }));

      Swal.close();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Image upload failed.", "error");
    }
  };

  const validateForm = () => {
    const { age, phone, nid, nidImage, bikeImage } = formData;
    if (!age || age < 18) {
      Swal.fire("Invalid Age", "You must be at least 18 years old.", "warning");
      return false;
    }
    if (!/^\d{11}$/.test(phone)) {
      Swal.fire("Invalid Phone", "Phone number must be 11 digits.", "warning");
      return false;
    }
    if (!/^\d{10,17}$/.test(nid)) {
      Swal.fire("Invalid NID", "NID must be 10 to 17 digits.", "warning");
      return false;
    }
    if (!nidImage || !bikeImage) {
      Swal.fire(
        "Missing Images",
        "Please upload both NID and bike images.",
        "warning"
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // Step 1: Check if the user already applied
      const { data } = await axiosSecure.get(
        `/riderApplications/${formData.email}`
      );
      if (data.exists) {
        return Swal.fire(
          "Already Applied",
          "You have already submitted a rider application.",
          "warning"
        );
      }

      // Step 2: Ask for confirmation
      const confirm = await Swal.fire({
        title: "Confirm Submission",
        text: "Do you want to submit this application?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, Submit",
        cancelButtonText: "Cancel",
      });

      if (!confirm.isConfirmed) return;

      // Step 3: Submit the form
      await axiosSecure.post("/riderApplications", formData);
      Swal.fire("Success", "Your application has been submitted!", "success");

      // Step 4: Reset form
      setFormData((prev) => ({
        ...prev,
        age: "",
        region: "",
        district: "",
        phone: "",
        nid: "",
        bikeBrand: "",
        bikeRegNumber: "",
        nidImage: "",
        bikeImage: "",
        additionalInfo: "",
      }));
      setSelectedRegion("");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Submission failed. Please try again.", "error");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6">Be a Rider Application</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name and Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={formData.name}
            readOnly
            className="input input-bordered w-full"
          />
          <input
            type="email"
            value={formData.email}
            readOnly
            className="input input-bordered w-full"
          />
        </div>

        {/* Age */}
        <input
          type="number"
          name="age"
          placeholder="Your Age"
          value={formData.age}
          onChange={handleChange}
          className="input input-bordered w-full"
          required
        />

        {/* Region and District */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="region"
            value={formData.region}
            onChange={handleChange}
            className="select select-bordered w-full"
            required
          >
            <option value="">Select Region</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>

          <select
            name="district"
            value={formData.district}
            onChange={handleChange}
            className="select select-bordered w-full"
            required
            disabled={!coveredAreas.length}
          >
            <option value="">Select Covered Area</option>
            {coveredAreas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        {/* Phone and NID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="number"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
          <input
            type="number"
            name="nid"
            placeholder="NID Card Number"
            value={formData.nid}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* NID Upload */}
        <label className="block mb-1 font-medium">Upload NID Card Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, "nidImage")}
          className="file-input file-input-bordered w-full"
          required
        />
        {formData.nidImage && (
          <img
            src={formData.nidImage}
            alt="NID Preview"
            className="mt-2 h-40 object-contain rounded border"
          />
        )}

        {/* Bike Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="bikeBrand"
            placeholder="Bike Brand"
            value={formData.bikeBrand}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
          <input
            type="text"
            name="bikeRegNumber"
            placeholder="Bike Registration Number"
            value={formData.bikeRegNumber}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* Bike Upload */}
        <label className="block mt-4 mb-1 font-medium">Upload Bike Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, "bikeImage")}
          className="file-input file-input-bordered w-full"
          required
        />
        {formData.bikeImage && (
          <img
            src={formData.bikeImage}
            alt="Bike Preview"
            className="mt-2 h-40 object-contain rounded border"
          />
        )}

        {/* Additional Info */}
        <textarea
          name="additionalInfo"
          placeholder="Additional Information (optional)"
          value={formData.additionalInfo}
          onChange={handleChange}
          className="textarea textarea-bordered w-full"
        />

        {/* Hidden Status */}
        <input type="hidden" name="status" value="pending" />

        <button type="submit" className="btn bg-[#CAEB66] text-black w-full">
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default BeARider;
