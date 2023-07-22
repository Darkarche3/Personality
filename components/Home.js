import React from 'react';
import { Navbar } from "./Navbar";
import Hero from './Hero';
import "./styles/Home.css";
import Companies from './Companies';
import Achievement from './Achievement';
import Feedback from './Feedback';

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