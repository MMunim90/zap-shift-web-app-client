import React from 'react';
import Banner from '../Banner/Banner';
import Services from '../Services/Services.jsx';
import HowItWorks from '../HowItWorks/HowItWorks.jsx';
import ClientCarousel from '../ClientCarousel/ClientCarousel.jsx';
import DeliveryFeatures from '../DeliveryFeatures/DeliveryFeatures.jsx';
import BeMerchant from '../BeMerchant/BeMerchant.jsx';
import Faq from '../FAQ/Faq.jsx';
import CustomersMessages from '../CustomersMessage/CustomersMessages.jsx';

const Home = () => {
    return (
        <div className='space-y-6'>
            <Banner/>
            <HowItWorks></HowItWorks>
            <Services></Services>
            <ClientCarousel></ClientCarousel>
            <DeliveryFeatures></DeliveryFeatures>
            <BeMerchant></BeMerchant>
            <CustomersMessages></CustomersMessages>
            <Faq></Faq>
        </div>
    );
};

export default Home;