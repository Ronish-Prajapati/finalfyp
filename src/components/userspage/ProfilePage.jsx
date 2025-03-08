import React, { useState, useEffect } from 'react';
import UserService from '../service/UserService';
import {  NavLink } from 'react-router-dom';



function ProfilePage() {
    const [profileInfo, setProfileInfo] = useState({});

    useEffect(() => {
        fetchProfileInfo();
    }, []);

    const fetchProfileInfo = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await UserService.getYourProfile(token);

            // Validate response and response.ourUsers
            if (response && response.ourusers) {
                const { name, email, city, role, id } = response.ourusers;

                if (name && email && city && role && id) {
                    setProfileInfo(response.ourusers);
                } else {
                    console.error('Incomplete profile data:', response.ourusers);
                }
            } else {
                console.error('Invalid profile data:', response);
            }
        } catch (error) {
            console.error('Error fetching profile information:', error);
        }
    };

    return (
        <div className="profile-page-container">
            <h2>Profile Information</h2>
            <p>Name: {profileInfo.name}</p>
            <p>Email: {profileInfo.email}</p>
            <p>City: {profileInfo.city}</p>
            {profileInfo.role === "ADMIN" && (
                <div className='profile-page-children'> <NavLink to={`/update-user/${profileInfo.id}`} className='profile-page-link'>Update This Profile</NavLink></div>
                
            )}
        </div>
    );
}

export default ProfilePage;
