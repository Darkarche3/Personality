import React from "react";
import { Navbar } from "../components/Navbar";
import "../styles/About.css";

// About page to describe project
export const About = () => {
  return (
    <div>
      <Navbar />
      <div className="about-container">
        About
        <p>
          Welcome to Personality, where we specialize in crafting standout resumes that leave a lasting impression. Our team of resume experts is dedicated to unlocking the true potential of your professional story. With a personalized approach, we tailor each resume to showcase your unique strengths and accomplishments, setting you apart from the competition. Collaborate with us to create a powerful marketing tool that grabs the attention of hiring managers and opens doors to new opportunities. Invest in your future with a professionally-crafted resume from Personality and take the first step towards career success. Contact us today to get started.
        </p>
      </div>
    </div>
  );
};