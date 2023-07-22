import React from 'react';
import '../App.css';
import { Navbar } from "../components/Navbar";
import { User } from '../scripts/FirebaseUtilities';

// The home page.
export const Home = () => {

    return (
      <div>
        <Navbar />
  
        <div className="Home">
          {User() == null && (
            <h1>WELCOME TO PERSONALITY!!!!!</h1>
          )}
          {User() != null && (
              <h1>Welcome to Personality, {User().name}!</h1>
          )}
        </div>
      </div>
    );
  };  