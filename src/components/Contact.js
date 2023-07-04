import React from "react";
import { useState } from "react";
import "./styles/Contact.css";
import { Navbar } from "./Navbar";
import { db } from "./Firebase";
import { ref, push, set } from "firebase/database";
import { User } from "./User";

// Contact Us Page
export const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    if (id === "name") {
        setName(value);
    }

    if (id === "email") {
        setEmail(value);
    }

    if (id === "message") {
        setMessage(value);
    }
  };

  const isEmptyOrSpaces = (str) => {
    return str === null || str.match(/^ *$/) !== null;
  }

  const Validation = () => {
    let nameregex = /^[a-zA-z\s]+$/;
    let emailregex = /^[a-zA-z0-9]+@(gmail|yahoo|outlook)\.com$/;

    if (isEmptyOrSpaces(name) || isEmptyOrSpaces(email) || isEmptyOrSpaces(message)) {
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

    return true;
  }

  const SendMessage = () => {
    if (!Validation()) {
        return;
    }

    const messageRef = ref(db, "Messages");

    set(push(messageRef),
    {
      name: name,
      email: email,
      message: message
    })
    .then(() => {
      alert("Message sent!");
    })
    .catch((error) => {
      alert("Error: " + error);
    });
  };

  return (
    <div>
      <Navbar />
      <div className="contact-form">
        <h2>Contact</h2>
        <div className="contact-container">
          <label htmlFor="name">Name</label>
          <input type="text" placeholder="Name" id="name"
            value={name} onChange={(e) => handleInputChange(e)}/>
          <label htmlFor="email">Email</label>
          <input type="email" placeholder="youremail@gmail.com" id="email"
            value={email} onChange={(e) => handleInputChange(e)}/>
          <label htmlFor="message">Message</label>
          <textarea type="text" placeholder="What do you want to say to us?" id="message"
            value={message} onChange={(e) => handleInputChange(e)}/>
          <button onClick={() => SendMessage()} type="submit" id="sendMessage">Submit</button>
        </div>
      </div>
    </div>
  );
};