import React from 'react';
import { Link } from 'react-router-dom';
import UserService from '../service/UserService';

function Navbar() {
    const isAuthenticated = UserService.isAuthenticated();

    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if (confirmLogout) {
            UserService.logout();
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/">Blog Recommendation</Link>
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/allblog">All Blogs</Link>
                        </li>
                        {!isAuthenticated ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">Register</Link>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <Link className="nav-link" to="/" onClick={handleLogout}>Logout</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
export default Navbar;
