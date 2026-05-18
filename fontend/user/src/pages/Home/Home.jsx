import React from 'react';
import HeroSection from './HeroSection';
import SeriesSection from '../../components/ui/SeriesSection';
import HelpChoose from '../../components/ui/HelpChoose';
import BestSellers from '../../components/ui/BestSellers';

import AccessoriesSection from '../../components/ui/AccessoriesSection';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page" style={{ backgroundColor: '#fff' }}>
      <HeroSection />

      <SeriesSection />

      <HelpChoose />

      <BestSellers />

      <AccessoriesSection />

    </div>
  );
};

export default Home;
