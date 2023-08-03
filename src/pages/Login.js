import React from 'react';
import { useState } from 'react';
import { Alert } from "reactstrap";
import { db } from "../Firebase";
import { ref, child, get } from "firebase/database";
import { AES, enc } from "crypto-js";
import "../styles/Login.css";

// Login page
export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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

  const isEmptyOrSpaces = (str) => {
    return str === null || str.match(/^ *$/) !== null;
  };

  const AuthenticateUser = () => {
    setErrorMsg("");

    if (isEmptyOrSpaces(username) || isEmptyOrSpaces(password)) {
      setErrorMsg("You cannot leave any field empty.");
      return;
    };

    const dbRef = ref(db);

    get(child(dbRef, "UsersList/" + username)).then((snapshot) => {
      if (snapshot.exists()) {
        let dbPass = decryptPassword(snapshot.val().password);
        if (dbPass === password) {
          login(snapshot.val());
        } else {
          setErrorMsg("Username or password is invalid.")
        }
      } else {
          setErrorMsg("User does not exist.");
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
      <div className='login-form'>
        <h2 data-testid="login">Log In</h2>
        {errorMsg && <Alert color="danger">{errorMsg}</Alert>}
        <div className='login-container'>
          <label htmlFor="username">Username</label>
          <input type="text" placeholder="Username" id="username"
            value={username} onChange={(e) => handleInputChange(e)} data-testid="login-username" />
          <label htmlFor="password">Password</label>
          <input type="password" placeholder="Password" id="password" 
            value={password} onChange={(e) => handleInputChange(e)} data-testid="login-password" />
          <input type="checkbox" id="keepLoggedIn"
            value={keepLoggedIn} onChange={handleKeepLoggedInChange} />
          <label htmlFor="keepLoggedIn">Keep me logged in</label>
          <button onClick={() => AuthenticateUser()} type="submit" id="loginButton" data-testid="login-submit">Log In</button>
          <a href="/signup" className="login" data-testid="link">Want to create a new account?</a>
        </div>
      </div>
    </div>
  );
};