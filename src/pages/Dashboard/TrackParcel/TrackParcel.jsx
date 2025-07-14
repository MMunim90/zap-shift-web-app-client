import { useParams, useNavigate } from "react-router";
import { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import dayjs from "dayjs";
import Loading from "../../shared/Loading/Loading";

const STEPS = [
  "parcel_created",
  "payment_done",
  "rider_assigned",
  "in_transit",
  "delivered",
];

const statusMap = {
  parcel_created: { badge: "badge-info", icon: "📦" },
  payment_done:    { badge: "badge-accent", icon: "💳" },
  rider_assigned:  { badge: "badge-warning", icon: "🧍" },
  in_transit:      { badge: "badge-primary", icon: "🚚" },
  delivered:       { badge: "badge-success", icon: "✅" },
  pending:         { badge: "badge-ghost",  icon: "⏳" },
};

const fetchTrackingData = async (axiosInstance, id) => {
  if (!id) throw new Error("Tracking ID is required");
  const { data } = await axiosInstance.get(`/tracking/${id}`);
  return data;
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
    staleTime: 60_000,
  });

  // Build a complete timeline: real data if present, otherwise a pending placeholder
  const timeline = useMemo(() => {
    const byStatus = trackingData.reduce((acc, cur) => {
      if (cur.status) acc[cur.status.toLowerCase()] = cur;
      return acc;
    }, {});

    return STEPS.map((step) =>
      byStatus[step] ?? {
        status: step,
        details: null,
        timestamp: null,
        location: null,
        pending: true,
      }
    );
  }, [trackingData]);

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

      {/* search box */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter Tracking ID"
          className="input input-bordered w-full"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
        />
        <button className="btn bg-[#CAEB66] text-black" type="submit" disabled={isFetching}>
          {isFetching ? "Searching..." : "Track"}
        </button>
      </form>

      {isLoading && <Loading />}
      {isError && <p className="text-red-500 text-center">No tracking information found.</p>}

      {/* timeline */}
      {timeline.length > 0 && (
        <>
          <h3 className="text-lg font-semibold mb-10 text-center">
            Tracking ID: <span className="text-[#CAEB66]">{trackingId}</span>
          </h3>

          <ul className="timeline timeline-vertical lg:timeline-horizontal">
            {timeline.map((step, idx) => {
              const isLast       = idx === timeline.length - 1;
              const completed    = !step.pending && step.status !== "pending";
              const { badge, icon } = statusMap[step.pending ? "pending" : step.status];

              const badgeClass = `badge ${badge} text-xs`;
              const lineColor  = completed ? "bg-[#CAEB66]" : "bg-gray-300";
              const dotColor   = completed ? "text-[#CAEB66]" : "text-gray-400";
              const boxClass   = "timeline-box bg-base-200 shadow-md";
              const formattedDate = step.timestamp
                ? dayjs(step.timestamp).format("DD-MM-YYYY")
                : "--";

              const Box = (
                <div className={`${idx % 2 === 0 ? "timeline-start" : "timeline-end"} ${boxClass}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={badgeClass}>{step.status.replaceAll("_", " ")}</span>
                    <span className="text-lg">{icon}</span>
                  </div>
                  {step.details && <p className="text-sm">{step.details}</p>}
                  <p className="text-xs text-gray-500">{formattedDate}</p>
                  {step.location && <p className="text-xs text-gray-400 italic">{step.location}</p>}
                </div>
              );

              return (
                <li key={idx}>
                  {idx !== 0 && <hr className={lineColor} />}
                  {Box}
                  <div className="timeline-middle">
                    <div className={`h-5 w-5 rounded-full ${dotColor}`}>⬤</div>
                  </div>
                  {!isLast && <hr className={lineColor} />}
                </li>
              );
            })}
          </ul>

          {/* legend */}
          <div className="mt-6 border-t pt-4 text-sm text-gray-400">
            <h4 className="font-semibold mb-2">Status Legend:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div><span className="badge badge-info mr-2">📦 parcel created</span>Parcel created</div>
              <div><span className="badge badge-accent mr-2">💳 payment done</span>Payment done</div>
              <div><span className="badge badge-warning mr-2">🧍 rider assigned</span>Rider assigned</div>
              <div><span className="badge badge-primary mr-2">🚚 in transit</span>In transit</div>
              <div><span className="badge badge-success mr-2">✅ delivered</span>Delivered</div>
              <div><span className="badge badge-ghost mr-2">⏳ pending</span>Waiting for update</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TrackParcel;
