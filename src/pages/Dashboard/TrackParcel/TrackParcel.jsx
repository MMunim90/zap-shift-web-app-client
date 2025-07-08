import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import dayjs from "dayjs";
import Loading from "../../shared/Loading/Loading";

const fetchTrackingData = async (axiosInstance, trackingId) => {
  if (!trackingId) throw new Error("Tracking ID is required");
  const res = await axiosInstance.get(`/tracking/${trackingId}`);
  return res.data;
};

const TrackParcel = () => {
  const { trackingId: urlTrackingId } = useParams();
  const [trackingId, setTrackingId] = useState(urlTrackingId || "");
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();

  const {
    data: trackingData = [],
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["tracking", trackingId],
    queryFn: () => fetchTrackingData(axiosPublic, trackingId),
    enabled: !!urlTrackingId,
  });

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!trackingId) return;
    navigate(`/dashboard/track/${trackingId}`);
    await refetch();
  };

  useEffect(() => {
    if (urlTrackingId) {
      setTrackingId(urlTrackingId);
    }
  }, [urlTrackingId]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Track Your Parcel</h2>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Enter Tracking ID"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
        />
        <button className="btn bg-[#CAEB66] text-black" type="submit">
          {isFetching ? "Searching..." : "Track"}
        </button>
      </form>

      {isLoading && <p className="text-blue-500"><Loading></Loading></p>}
      {error && <p className="text-red-500">No tracking information found.</p>}

      {trackingData.length > 0 && (
        <div className="rounded p-4 border">
          <h3 className="text-lg font-semibold mb-2">Tracking ID: {trackingId}</h3>
          <ul className="timeline timeline-vertical">
            {trackingData.map((update, idx) => (
              <li key={idx}>
                <div className="timeline-start">{update.location}</div>
                <div className="timeline-middle badge badge-success"></div>
                <div className="timeline-end">
                  <p>{update.status}</p>
                  <p className="text-xs text-gray-500">
                    {dayjs(update.creation_date).format("YYYY-MM-DD HH:mm")}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TrackParcel;
