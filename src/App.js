import React from 'react';
import './App.css';
import { Route, Routes } from "react-router-dom";
import { PageLoader } from './components/PageLoader';
import { Admin } from './components/Admin';
import { Callback } from './components/Callback';
import { Home } from './components/Home';
import { NotFound } from './components/NotFound';
import { Profile } from './components/Profile';
import { Careers } from './components/Careers';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Faq } from './components/Faq';
import { Marketplace } from './components/Marketplace';
import { Signup } from './components/Signup';
import { Login } from './components/Login';
import  ForumPage  from './components/ForumPage';
import Replies from './components/Replies';



export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/callback" element={<Callback />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/faq" element={<Faq />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/forum" element={<ForumPage />} />
      <Route path="/replies" element={<Replies />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      
    </Routes>
  );
};