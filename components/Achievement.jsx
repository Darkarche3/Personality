import React from "react";
import { cta } from "./assets";
import { SlGraduation } from "react-icons/sl";
import { SlPeople } from "react-icons/sl";
import { CgAwards } from "react-icons/cg"
import "../styles/Achievement.css"
import { SlOrganization } from 'react-icons/sl'



const Achievement = () => {
  return (
    <div className="alpha">
      <div className="beta">
        <div className="charlie ">
          <h1 className="delta">
            Our <span className="echo">Achievements</span>
          </h1>
          <p className="foxtrot">
            Various versions have evolved over the years, sometimes by accident.
          </p>
          <div className="order">
            <div>
              <div className="golf">
                <div className="hotel">
                  <div className="india">
                    <SlOrganization size={30} style={{ color: "#1A906B" }} />
                  </div>
                  <div className="juliet">
                    <h1 className="kilo">300</h1>
                    <p className="lima">employees</p>
                  </div>
                </div>
                <div className="hotel">
                  <div className="extra">
                    <CgAwards size={30} style={{ color: "yellow" }} />
                  </div>
                  <div className="juliet">
                    <h1 className="kilo">10+</h1>
                    <p className="lima">Awards</p>
                  </div>
                </div>
                <div className="hotel">
                  <div className="mike">
                    <SlGraduation size={30} style={{ color: "#ED4459" }} />
                  </div>
                  <div className="juliet">
                    <h1 className="kilo">20,000+</h1>
                    <p className="lima">Student</p>
                  </div>
                </div>
                <div className="hotel">
                  <div className="november">
                    <SlPeople size={30} style={{ color: "#0075FD" }} />
                  </div>
                  <div className="juliet">
                    <h1 className="kilo">1,00,000+</h1>
                    <p className="lima">Users</p>
                  </div>
                </div>
              </div>
            </div>
            <img
              src={cta}
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievement;
