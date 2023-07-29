import React from 'react';
import { Link } from 'react-router-dom';
import { LoginButton } from './LoginButton';
import { SignoutButton } from './SignoutButton';
import { SignupButton } from './SignupButton';
import { isAdmin, User } from '../scripts/FirebaseUtilities';
import '../styles/Navbar.css';

// The navigation page
export const Navbar = () => {
  return (
    <div className='sum'>
      <div className='logo'>
        Personality
      </div>
      <nav classitem="item">
        <ul className="ul">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
          <li>
            <Link to="/faq">Faq</Link>
          </li>
          <li>
            <Link to="/marketplace">Marketplace</Link>
          </li>
          {User() == null && (
            <>
              <li>
                <Link to="/login">Forum</Link>
              </li>
            </>
          )}
          {User() != null && (
            <>
              <li>
                <Link to="/forum">Forum</Link>
              </li>
            </>
          )}
          {isAdmin() && (
            <>
              <li>
                <Link to="https://personalitydashboard.netlify.app/">Admin</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      <div className="nav-bar__buttons">
        {User() == null && (
          <>
            <SignupButton />
            <LoginButton />
          </>
        )}
        {User() != null && (
          <>
            <Link to="">{User().username}</Link>
            <SignoutButton />
          </>
        )}
      </div>
    </div>
  );
};
export default Navbar;