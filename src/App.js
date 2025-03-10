// App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from './components/common/Navbar';
import LoginPage from './components/auth/LoginPage';
import RegistrationPage from './components/auth/RegistrationPage';
import FooterComponent from './components/common/Footer';
import UserService from './components/service/UserService';
import UpdateUser from './components/userspage/UpdateUser';
import UserManagementPage from './components/userspage/UserManagementPage';
import ProfilePage from './components/userspage/ProfilePage';
import CategoryForm from './components/CategoryForm';
import BlogForm from './components/BlogForm';
import BlogPage from './components/BlogPage';
import SingleBlog from './components/SingleBlog';
import UserBlog from './components/UserBlog';


function App() {

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            <Route exact path="/" element={<LoginPage />} />
            <Route exact path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage  />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/categories" element={<CategoryForm />} />
            <Route path="/blog" element={<BlogForm />} />
            <Route path="/allblog" element={<BlogPage />} />
            <Route path="/blog/:id/:email" element={<SingleBlog />} />
    <Route 
          path="/user/:userId/posts" 
          element={<UserBlog /> } 
        />

            {/* Check if user is authenticated and admin before rendering admin-only routes */}
            {UserService.adminOnly() && (
              <>
               
                <Route path="/admin/user-management" element={<UserManagementPage />} />
                <Route path="/update-user/:userId" element={<UpdateUser />} />
              </>
            )}
            
          </Routes>
        </div>
        
      </div>
    </BrowserRouter>
  );
}

export default App;
