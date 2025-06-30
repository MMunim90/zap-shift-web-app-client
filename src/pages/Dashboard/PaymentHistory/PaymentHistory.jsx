import React from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../shared/Loading/Loading";
import dayjs from "dayjs";

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { isPending, data: payments = [] } = useQuery({
    queryKey: ["payments", user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user.email}`);
      return res.data;
    },
  });

  if (isPending) {
    return <Loading></Loading>;
  }
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Payment History</h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="bg-[#CAEB66] text-black">
            <tr>
              <th>#</th>
              <th>Transaction ID</th>
              <th>Amount (৳)</th>
              <th>Payment Method</th>
              <th>Paid At</th>
              <th>Parcel ID</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No payment history found.
                </td>
              </tr>
            ) : (
              payments.map((payment, index) => (
                <tr key={payment._id}>
                  <td>{index + 1}</td>
                  <td className="font-mono">{payment.transactionId}</td>
                  <td>৳{payment.amount}</td>
                  <td className="capitalize">{payment.paymentMethod}</td>
                  <td>
                    {dayjs(payment.paid_at).format("YYYY-MM-DD HH:mm:ss")}
                  </td>
                  <td className="text-xs text-[#CAEB66]">{payment.parcelId}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;
