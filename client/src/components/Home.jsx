import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkAuthentication = async () => {
    try {
      const response = await axios.get("/api/authenticate");
      console.log(response);
      setAuthenticated(response.data);
    } catch (err) {
      console.error(err.message);
    } finally {
      getUserDetails();
      setLoading(false);
    }
  };

  const getUserDetails = async () => {
    const response = await axios.get("/api/userdetails");
    setUserDetails(response.data);
  }

  const handleLogout = async () => {
    try {
      const response = await axios.post("/api/logout");
      console.log(response);
      
      navigate("/login");
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  if (loading) {
    // Show a loading indicator while authentication status is being checked
    return <div>Loading...</div>;
  }

  if (authenticated) {
    return (
      <>
        <h1>Hello {userDetails.username}</h1>
        <button onClick={handleLogout}>Logout</button>
      </>
    );
  } else {
    return <Navigate replace to="/login" />;
  }
};

export default Home;
