import React, { useState } from "react";
import Axios from "axios";

export const Register = (props) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [name, setName] = useState('');

    const register = () => {
      Axios.post("http://localhost:3005/register", {
        name: name,
        email: email,
        pass: pass
      }).then((response) => {
        console.log(response);
      });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email);
    };

    return (
        <div className ="auth-form-container">
            <h2>Register</h2>
        <form className ="register-form" onSubmit={handleSubmit}>
          <label htmlFor='name'>Full name</label>
          <input 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            type="name"
            placeholder="Full Name"
            id="name"
            name="name"
          />
          <label htmlFor='email'>email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="youremail@gmail.com"
            id="email"
            name="email"
          />
          <label htmlFor='password'>password</label>
          <input
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            type="password"
            placeholder="enter your password"
            id="password"
            name="password"
          />
          <button type="submit" onClick={register}>Register</button>
        </form>
        <button className="link-btn" onClick={() => props.onFormSwitch('login')}> Already have an Account? Login here.</button>
      </div>
    )
}