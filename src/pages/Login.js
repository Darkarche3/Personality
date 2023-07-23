import React from 'react';
import { useState } from 'react';
import { Navbar } from "../components/Navbar";
import { db } from "../Firebase";
import { ref, child, get } from "firebase/database";
import { AES, enc } from "crypto-js";
import "../styles/Login.css";

// Login page
export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    if (id === "username") {
      setUsername(value);
    }

    if (id === "password") {
      setPassword(value);
    }

    if (id === "keepLoggedIn") {
      setKeepLoggedIn(value);
    }
  };

  const handleKeepLoggedInChange = () => {
    setKeepLoggedIn(!keepLoggedIn);
  };

  const AuthenticateUser = () => {
    const dbRef = ref(db);

    get(child(dbRef, "UsersList/" + username)).then((snapshot) => {
      if (snapshot.exists()) {
        let dbPass = decryptPassword(snapshot.val().password);
        if (dbPass === password) {
          login(snapshot.val());
        } else {
          alert("Username or password is invalid.")
        }
      } else {
          alert("User does not exist.");
      }
    });
  };

  const decryptPassword = (dbPass) => {
    var pass12 = AES.decrypt(dbPass, password);
    return pass12.toString(enc.Utf8);
  };

  const login = (user) => {
    if (!keepLoggedIn) {
      sessionStorage.setItem('user', JSON.stringify(user));
      window.location="/";
    } else {
      localStorage.setItem('keepLoggedIn', 'yes');
      localStorage.setItem('user', JSON.stringify(user));
      window.location="/";
    }
  }

  return (
    <div>
      <Navbar />
      <div className='login-form'>
        <h2>Log In</h2>
        <div className='login-container'>
          <label htmlFor="username">Username</label>
          <input type="text" placeholder="Username" id="username"
            value={username} onChange={(e) => handleInputChange(e)} />
          <label htmlFor="password">Password</label>
          <input type="password" placeholder="Password" id="password" 
            value={password} onChange={(e) => handleInputChange(e)} />
          <input type="checkbox" id="keepLoggedIn"
            value={keepLoggedIn} onChange={handleKeepLoggedInChange} />
          <label htmlFor="keepLoggedIn">Keep me logged in</label>
          <button onClick={() => AuthenticateUser()} type="submit" id="loginButton">Log In</button>
          <a href="/signup" class="login">Want to create a new account?</a>
        </div>
      </div>
    </div>
  );
};