import React from 'react';
import '../App.css';
import { Navbar } from "../components/Navbar";
import Hero from '../components/Hero';
import Companies from '../components/Companies';
import Achievement from '../components/Achievement';

// The home page.
export const Home = () => {
  return (
    <div >
      <div>
        <Navbar />
        <Hero />
        <Companies />
        <Achievement />
      </div>
    </div>
  );
};  