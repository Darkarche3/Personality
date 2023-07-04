import React from 'react';
import { Link } from 'react-router-dom';
import { LoginButton } from './buttons/LoginButton';
import { SignoutButton } from './buttons/SignoutButton';
import { SignupButton } from './buttons/SignupButton';
import './styles/Navbar.css';

// The navigation page
export const Navbar = () => {
    var currentUser = null;

    if (localStorage.getItem("keepLoggedIn") == "yes") {
        currentUser = JSON.parse(localStorage.getItem('user'));
    } else {
        currentUser = JSON.parse(sessionStorage.getItem('user'));
    }

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
                        <Link to="/about">About</Link>
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
                    <li>
                        <Link to="/forum">Forum</Link>
                    </li>
                    <li>
                        <Link to="/replies">Replies</Link>
                    </li>
                </ul>
            </nav>
            <div className="nav-bar__buttons">
                {currentUser == null && (
                    <>
                        <SignupButton />
                        <LoginButton />
                    </>
                )}
                {currentUser != null && (
                    <>
                        <SignoutButton />
                    </>
                )}
            </div>
        </div>
    );
};
export default Navbar;