import React from 'react';
import { useState } from 'react';
import { Alert } from "reactstrap";
import { db } from "../Firebase";
import { ref, set, child, get } from "firebase/database";
import { AES } from "crypto-js";
import "../styles/Signup.css";

// Signup page
export const Signup = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");


  const handleInputChange = (e) => {
    const { id, value } = e.target;

    if (id === "name") {
      setName(value);
    }

    if (id === "email") {
      setEmail(value);
    }

    if (id === "username") {
      setUsername(value);
    }

    if (id === "password") {
      setPassword(value);
    }

    if (id === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  const isEmptyOrSpaces = (str) => {
    return str === null || str.match(/^ *$/) !== null;
  };

  const Validation = () => {
    let nameregex = /^[a-zA-Z\s]+$/;
    let emailregex = /^[a-zA-Z0-9]+@(gmail|yahoo|outlook)\.com$/;
    let userregex = /^[a-zA-Z0-9]{5,36}$/;
    let passregex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/;

    if (isEmptyOrSpaces(name) || isEmptyOrSpaces(email) || isEmptyOrSpaces(username) ||
      isEmptyOrSpaces(password) || isEmptyOrSpaces(confirmPassword)) {
      setErrorMsg("You cannot leave any field empty.");
      return false;
    }

    if (!nameregex.test(name)) {
      setErrorMsg("The name should only contain letters!");
      return false;
    }

    if (!emailregex.test(email)) {
      setErrorMsg("Please enter a valid email.");
      return false;
    }

    if (!userregex.test(username)) {
      setErrorMsg("Username must only contain alphanumeric characters, must be between 5 and 36 characters long, and must not contain spaces.");
      return false;
    }

    if (!passregex.test(password)) {
      setErrorMsg("Password must be at least 8 characters long and contain at least one uppercase letter, lowercase letter, and number.");
      return false;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return false;
    }

    return true;
  }

  const RegisterUser = () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!Validation()) {
      return;
    }

    const dbRef = ref(db);

    get(child(dbRef, "UsersList/" + username)).then((snapshot) => {
      if (snapshot.exists()) {
        setErrorMsg("Account already exists!");
      } else {
        set(ref(db, "UsersList/" + username), 
        {
          name: name,
          email: email,
          username: username,
          password: encryptPassword()
        })
        .then(() => {
          setSuccessMsg("Account created!");
        })
        .catch((error) => {
          setErrorMsg("Error: " + error);
        });
      }
    });
  };

  const encryptPassword = () => {
    var pass12 = AES.encrypt(password, password);
    return pass12.toString();
  }

  return (
    <div>
      <div className='signup-form'>
        <h2>Sign Up</h2>
        {successMsg && <Alert color="success">{successMsg}</Alert>}
        {errorMsg && <Alert color="danger">{errorMsg}</Alert>}
        <div className='signup-container'>
          <label htmlFor="name">Full Name</label>
          <input type="text" placeholder="Full name" id="name"
            value={name} onChange={(e) => handleInputChange(e)} data-testid="signup-fullname"/>
          <label htmlFor="email">Email</label>
          <input type="text" placeholder="Email" id="email" 
            value={email} onChange={(e) => handleInputChange(e)} data-testid="signup-email"/>
          <label htmlFor="username">Username</label>
          <input type="text" placeholder="Username" id="username" 
            value={username} onChange={(e) => handleInputChange(e)} data-testid="signup-username"/>
          <label htmlFor="password">Password</label>
          <input type="password" placeholder="Password" id="password" 
            value={password} onChange={(e) => handleInputChange(e)} data-testid="signup-password"/>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input type="password" placeholder="Confirm Password" id="confirmPassword" 
            value={confirmPassword} onChange={(e) => handleInputChange(e)} data-testid="signup-confirmpass"/>
          <button onClick={() => RegisterUser()} type="submit" id="signupButton" data-testid="signup-submit">Sign Up</button>
          <a href="/login" className="signup" data-testid="link">Already have an account?</a>
        </div>
      </div>
    </div>
  );
};