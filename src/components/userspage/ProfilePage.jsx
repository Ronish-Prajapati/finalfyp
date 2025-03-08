import React, { useState, useEffect } from "react";
import UserService from "../service/UserService";
import { NavLink } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

function ProfilePage() {
  const [profileInfo, setProfileInfo] = useState({});

  useEffect(() => {
    fetchProfileInfo();
  }, []);

  const fetchProfileInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await UserService.getYourProfile(token);

      if (response && response.ourUsers) {
        const { name, email, city, role, userId } = response.ourUsers;

        if (name && email && role && userId) {
          setProfileInfo(response.ourUsers);
          console.log(response.ourUsers);
        } else {
          console.error("Incomplete profile data:", response.ourUsers);
        }
      } else {
        console.error("Invalid profile data:", response);
      }
    } catch (error) {
      console.error("Error fetching profile information:", error);
    }
  };

  return (
    <div className="container d-flex justify-content-center mt-5">
      <div className="card p-4 shadow-sm text-center" style={{ width: "350px", borderRadius: "10px" }}>
        <div className="mb-3">
          <div className="d-flex justify-content-center align-items-center rounded-circle bg-light" style={{ width: "100px", height: "100px", margin: "auto" }}>
            <FaUser className="text-secondary" size={50} />
          </div>
        </div>
        <h4 className="mb-1">{profileInfo.name}</h4>
        <p className="text-muted">{profileInfo.email}</p>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <strong>City:</strong> {profileInfo.city || "N/A"}
          </li>
        </ul>
        {profileInfo.role === "1" && (
          <div className="mt-3">
            <NavLink
              to={`/update-user/${profileInfo.id}`}
              className="btn btn-primary btn-sm"
            >
              Update Profile
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
