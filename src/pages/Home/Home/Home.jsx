import React from 'react';
import Banner from '../Banner/Banner';
import Services from '../Services/Services.jsx';
import HowItWorks from '../HowItWorks/HowItWorks.jsx';

const Home = () => {
    return (
        <div className='space-y-6'>
            <Banner/>
            <HowItWorks></HowItWorks>
            <Services></Services>
        </div>
    );
};

export default Home;