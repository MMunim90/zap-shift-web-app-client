import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loading from "../../shared/Loading/Loading";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import useTrackingUpdater from "../../../hooks/useTrackingUpdater";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");
  const { parcelId } = useParams();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const {updateTracking} = useTrackingUpdater();

  const { isPending, data: parcelInfo = {} } = useQuery({
    queryKey: ["parcels", parcelId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/${parcelId}`);
      return res.data;
    },
  });

  if (isPending) {
    return <Loading></Loading>;
  }

  //console.log(parcelInfo);
  const amount = parcelInfo.total_cost;
  const amountInCents = amount * 100;
  //console.log(amountInCents);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    const card = elements.getElement(CardElement);

    if (!card) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      setError(error.message);
    } else {
      setError("");
      //console.log("payment method", paymentMethod);

      // step-2: create payment intent
      const res = await axiosSecure.post("/create-payment-intent", {
        amountInCents,
        parcelId,
      });

      const clientSecret = res.data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user.displayName,
            email: user.email,
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
      } else {
        setError("");
        if (result.paymentIntent.status === "succeeded") {
          // console.log("Payment succeeded!");
          //console.log(result);

          // mark parcel paid also create payment history
          const paymentData = {
            parcelId,
            email: user.email,
            amount,
            transactionId: result.paymentIntent.id,
            paymentMethod: result.paymentIntent.payment_method_types,
          };

          const paymentRes = await axiosSecure.post("/payments", paymentData);
          if (paymentRes.data.insertResult) {
            Swal.fire({
              title: "Payment succeeded!",
              html: `<strong>Transaction Id:</strong><code> ${result.paymentIntent.id}</code>`,
              icon: "success",
              confirmButtonColor: "#CAEB66",
              confirmButtonText: "Done",
              draggable: true,
            }).then(() => {
              navigate("/dashboard/myParcels");
            });
          }
        }
      }
    }

    await updateTracking({
        tracking_id: parcelInfo.tracking_id,
        status: "payment_done",
        details: `Paid by ${user.displayName}`,
        location: parcelInfo.senderArea,
        updated_by: user.email,
      });
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-6 bg-white rounded-2xl w-full max-w-md mx-auto mt-12"
      >
        <CardElement className="p-6 border border-black rounded-2xl"></CardElement>
        <button
          className="btn bg-[#CAEB66] text-black w-full"
          type="submit"
          disabled={!stripe}
        >
          Pay ৳{amount}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default PaymentForm;
