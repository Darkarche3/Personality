import React from "react";
import "../styles/Hero.css";
import { User } from "./User";

const Hero = () => {
  return (
    <div className="a">
      <div className="b">
        <div>
          <div>
            {User() == null && <h1 className="d">PERSONALITY</h1>}
            {User() != null && (
              <h1 className="d">Welcome to Personality, {User().name}!</h1>
            )}
          </div>
          <div >
            <div >
              <p className="words">
                <span className="g">Choose</span> the{" "}
                <span className="g">resume</span> that fits{" "}
                <span className="g">You</span>
              </p>
            </div>
          </div>
        </div>
        <img
          className="f"
          src="https://cdn-images.zety.com/pages/free_resume_templates_new_6.jpg"
          alt=""
        />
      </div>
    </div>
  );
};

export default Hero;
