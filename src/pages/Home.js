import React from 'react';
import '../App.css';
import Hero from '../components/Hero';
import Companies from '../components/Companies';
import Achievement from '../components/Achievement';

// The home page.
export const Home = () => {
  return (
    <div >
      <div>
        <Hero />
        <Companies />
        <Achievement />
      </div>
    </div>
  );
};  