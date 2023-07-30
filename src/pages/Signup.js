import React from 'react';
import { useState } from 'react';
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
    let nameregex = /^[a-zA-z\s]+$/;
    let emailregex = /^[a-zA-z0-9]+@(gmail|yahoo|outlook)\.com$/;
    let userregex = /^[a-zA-z0-9]{5,}$/;

    if (isEmptyOrSpaces(name) || isEmptyOrSpaces(email) || isEmptyOrSpaces(username) ||
      isEmptyOrSpaces(password) || isEmptyOrSpaces(confirmPassword)) {
      alert("You cannot leave any field empty.");
      return false;
    }

    if (!nameregex.test(name)) {
      alert("The name should only contain letters!");
      return false;
    }

    if (!emailregex.test(email)) {
      alert("Please enter a valid email.");
      return false;
    }

    if (!userregex.test(username)) {
      alert("- Username must only contain alphanumeric characters.\n- Username must be at least 5 characers long.\n- Username must not contain spaces.");
      return false;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return false;
    }

    return true;
  }

  const RegisterUser = () => {
    if (!Validation()) {
      return;
    }

    const dbRef = ref(db);

    get(child(dbRef, "UsersList/" + username)).then((snapshot) => {
      if (snapshot.exists()) {
        alert("Account already exists!");
      } else {
        set(ref(db, "UsersList/" + username), 
        {
          name: name,
          email: email,
          username: username,
          password: encryptPassword()
        })
        .then(() => {
          alert("Account created!");
        })
        .catch((error) => {
          alert("Error: " + error);
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
        <div className='signup-container'>
          <label htmlFor="name">Full Name</label>
          <input type="text" placeholder="Full name" id="name"
            value={name} onChange={(e) => handleInputChange(e)} />
          <label htmlFor="email">Email</label>
          <input type="text" placeholder="Email" id="email" 
            value={email} onChange={(e) => handleInputChange(e)} />
          <label htmlFor="username">Username</label>
          <input type="text" placeholder="Username" id="username" 
            value={username} onChange={(e) => handleInputChange(e)} />
          <label htmlFor="password">Password</label>
          <input type="password" placeholder="Password" id="password" 
            value={password} onChange={(e) => handleInputChange(e)} />
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input type="password" placeholder="Confirm Password" id="confirmPassword" 
            value={confirmPassword} onChange={(e) => handleInputChange(e)} />
          <button onClick={() => RegisterUser()} type="submit" id="signupButton">Sign Up</button>
          <a href="/login" class="signup">Already have an account?</a>
        </div>
      </div>
    </div>
  );
};