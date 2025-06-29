import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Loading from '../../shared/Loading/Loading';

const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState('');
    const {parcelId} = useParams();
    const axiosSecure = useAxiosSecure();
    
    const {isPending, data: parcelInfo = {}} = useQuery({
        queryKey: ['parcels', parcelId],
        queryFn: async() => {
            const res = await axiosSecure.get(`/parcels/${parcelId}`);
            return res.data;
        }
    })

    if(isPending){
        return <Loading></Loading>
    }

    console.log(parcelInfo)
    const amount = parcelInfo.total_cost

    const handleSubmit = async(e) => {
        e.preventDefault()
        if(!stripe || !elements){
            return;
        }
        const card = elements.getElement(CardElement)

        if(!card){
            return;
        }

        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: 'card',
            card
        })

        if(error){
            setError(error.message)
        }
        else{
            setError('');
            console.log('payment method', paymentMethod)
        }
    }
    return (
        <div>
            <form onSubmit={handleSubmit} className='space-y-4 p-6 bg-white rounded-2xl w-full max-w-md mx-auto mt-12'>
                <CardElement className='p-6 border border-black rounded-2xl'>
                </CardElement>
                    <button className='btn bg-[#CAEB66] text-black w-full' type='submit' disabled={!stripe}>
                        Pay ৳{amount}
                    </button>
                    {
                        error && <p className='text-red-500'>{error}</p>
                    }
            </form>
        </div>
    );
};

export default PaymentForm;