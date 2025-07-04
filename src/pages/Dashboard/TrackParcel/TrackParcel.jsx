import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";

const TrackParcel = () => {
  const { trackingId: urlTrackingId } = useParams();
  const [trackingId, setTrackingId] = useState(urlTrackingId || "");
  const [trackingData, setTrackingData] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchTracking = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/tracking/${id}`);
      setTrackingData(res.data);
      setError("");
    } catch (err) {
        setError(err);
      setTrackingData([]);
      setError("No tracking information found");
    }
  };

  useEffect(() => {
    if (urlTrackingId) {
      fetchTracking(urlTrackingId);
    }
  }, [urlTrackingId]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (trackingId) {
      navigate(`/dashboard/track/${trackingId}`);
      fetchTracking(trackingId);
    }
  };

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
        <button className="btn bg-[#CAEB66] text-black">Track</button>
      </form>

      {error && <p className="text-red-500">{error}</p>}

      {trackingData.length > 0 && (
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-lg font-semibold mb-2">Tracking ID: {trackingId}</h3>
          <ul className="timeline timeline-vertical">
            {trackingData.map((update, idx) => (
              <li key={idx}>
                <div className="timeline-start">{update.location}</div>
                <div className="timeline-middle badge badge-success"></div>
                <div className="timeline-end">
                  <p>{update.status}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(update.timestamp).toLocaleString()}
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
