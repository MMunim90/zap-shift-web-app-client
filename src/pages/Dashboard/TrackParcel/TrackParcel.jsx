import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import dayjs from "dayjs";
import Loading from "../../shared/Loading/Loading";

const fetchTrackingData = async (axiosInstance, id) => {
  if (!id) throw new Error("Tracking ID is required");
  const res = await axiosInstance.get(`/tracking/${id}`);
  return res.data;
};

const TrackParcel = () => {
  const { trackingId: urlTrackingId } = useParams();
  const [trackingId, setTrackingId] = useState(urlTrackingId ?? "");
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();

  const {
    data: trackingData = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["tracking", trackingId],
    queryFn: () => fetchTrackingData(axiosPublic, trackingId),
    enabled: !!trackingId,
    staleTime: 60000,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (!trackingId) return;
    navigate(`/dashboard/track/${trackingId}`);
    refetch();
  };

  useEffect(() => {
    setTrackingId(urlTrackingId ?? "");
  }, [urlTrackingId]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Track Your Parcel</h2>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Enter Tracking ID"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
        />
        <button className="btn bg-[#CAEB66] text-black" type="submit" disabled={isFetching}>
          {isFetching ? "Searching..." : "Track"}
        </button>
      </form>

      {isLoading && (
        <div className="text-blue-500">
          <Loading />
        </div>
      )}
      {isError && (
        <p className="text-red-500 text-center">No tracking information found.</p>
      )}

      {trackingData.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-10 text-center">
            Tracking ID: <span className="text-[#CAEB66]">{trackingId}</span>
          </h3>

          <ul className="timeline timeline-vertical lg:timeline-horizontal">
            {trackingData.map((update, idx) => {
              const isLast = idx === trackingData.length - 1;
              const status = update.status?.toLowerCase() || "pending";
              const isCompleted = status !== "pending";

              const statusMap = {
                parcel_created: {
                  badge: "badge-info",
                  icon: "📦",
                },
                payment_done: {
                  badge: "badge-accent",
                  icon: "💳",
                },
                rider_assigned: {
                  badge: "badge-warning",
                  icon: "🧍",
                },
                in_transit: {
                  badge: "badge-primary",
                  icon: "🚚",
                },
                delivered: {
                  badge: "badge-success",
                  icon: "✅",
                },
                pending: {
                  badge: "badge-ghost",
                  icon: "⏳",
                },
              };

              const { icon, badge } = statusMap[status] || statusMap["pending"];
              const badgeClass = badge || "badge-ghost";
              const lineColor = isCompleted ? "bg-[#CAEB66]" : "bg-gray-300";
              const dotColor = isCompleted ? "text-[#CAEB66]" : "text-gray-400";
              const boxClass = "timeline-box bg-base-200 shadow-md";

              return (
                <li key={idx}>
                  {idx !== 0 && <hr className={lineColor} />}
                  {idx % 2 === 0 ? (
                    <div className={`timeline-start ${boxClass}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`badge ${badgeClass} text-xs`}>
                          {update.status.replaceAll("_", " ")}
                        </span>
                        <span className="text-lg">{icon}</span>
                      </div>
                      {update.details && (
                        <p className="text-sm">{update.details}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        {dayjs(update.timestamp).format("DD-MM-YYYY")}
                      </p>
                      <p className="text-xs text-gray-400 italic">
                        {update.location}
                      </p>
                    </div>
                  ) : (
                    <div className={`timeline-end ${boxClass}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`badge ${badgeClass} text-xs`}>
                          {update.status.replaceAll("_", " ")}
                        </span>
                        <span className="text-lg">{icon}</span>
                      </div>
                      {update.details && (
                        <p className="text-sm">{update.details}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        {dayjs(update.timestamp).format("DD-MM-YYYY")}
                      </p>
                      <p className="text-xs text-gray-400 italic">
                        {update.location}
                      </p>
                    </div>
                  )}
                  <div className="timeline-middle">
                    <div className={`h-5 w-5 rounded-full ${dotColor}`}>⬤</div>
                  </div>
                  {!isLast && <hr className={lineColor} />}
                </li>
              );
            })}
          </ul>

          {/* Legend */}
          <div className="mt-6 border-t pt-4 text-sm text-gray-600">
            <h4 className="font-semibold mb-2">Status Legend:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="badge badge-info mr-2">📦 parcel_created</span>
                Parcel created by sender
              </div>
              <div>
                <span className="badge badge-accent mr-2">💳 payment_done</span>
                Payment done
              </div>
              <div>
                <span className="badge badge-warning mr-2">🧍 rider_assigned</span>
                Rider assigned
              </div>
              <div>
                <span className="badge badge-primary mr-2">🚚 in_transit</span>
                In transit
              </div>
              <div>
                <span className="badge badge-success mr-2">✅ delivered</span>
                Delivered
              </div>
              <div>
                <span className="badge badge-ghost mr-2">⏳ pending</span>
                Waiting for update
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackParcel;
