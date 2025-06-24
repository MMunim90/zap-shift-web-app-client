import React from 'react';
import Banner from '../Banner/Banner';
import Services from '../Services/Services.jsx';
import HowItWorks from '../HowItWorks/HowItWorks.jsx';
import ClientCarousel from '../ClientCarousel/ClientCarousel.jsx';

const Home = () => {
    return (
        <div className='space-y-6'>
            <Banner/>
            <HowItWorks></HowItWorks>
            <Services></Services>
            <ClientCarousel></ClientCarousel>
        </div>
    );
};

export default Home;