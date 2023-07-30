import React from 'react';
import './App.css';
import { Route, Routes } from "react-router-dom";
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { Contact } from './pages/Contact';
import { Faq } from './pages/Faq';
import { Marketplace } from './pages/Marketplace';
import { Signup } from './pages/Signup';
import { Login } from './pages/Login';
import { ForumList } from './pages/ForumList';
import { Post } from './pages/Post';
import { Create } from './pages/Create';
import { Edit } from './components/Edit';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/faq" element={<Faq />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route exact path="/forum" element={<ForumList />} />
      <Route exact path="/create" element={<Create />} />
      <Route exact path="/post/:id" element={<Post />} />
      <Route exact path="/edit/:postkey/:commentid" element={<Edit />} />
    </Routes>
  );
};