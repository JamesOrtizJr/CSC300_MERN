import React from "react";
// We use Route in order to define the different routes of our application
import { Route, Routes, Navigate } from "react-router-dom";
import './css/card.css';
import './index.css';

// We import all the components we need in our app
import Navbar from "./components/navbar";
import LandingPage from "./components/pages/landingPage";
import HomePage1 from "./components/pages/homepage1";
import Login from "./components/pages/loginPage";
import Signup from "./components/pages/registerPage";
import PrivateUserProfile from "./components/pages/privateUserProfilePage";
import { createContext, useState, useEffect } from "react";
import getUserInfo from "./utilities/decodeJwt";
import MovieDetailsPage from "./components/pages/movieDetailsPage";
import CastCrewPage from "./components/pages/castAndCrewPage";

import AccessDenied from "./components/pages/AccessDenied";






// ADMIN
import AdminPage from "./components/pages/AdminPage";
// Roulette
import MovieRoulette from "./components/pages/MovieRoulette";


export const UserContext = createContext();
//test change
//test again
const App = () => {
  const [user, setUser] = useState(null);

useEffect(() => {
  const info = getUserInfo();
  console.log("decoded user:", info);
  setUser(info);
}, []);

  return (
    <>
    
      <Navbar />
      <UserContext.Provider value={{user, setUser}}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/homepage1" element={<HomePage1 />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/privateUserProfile" element={<PrivateUserProfile />} />



          <Route path="/movies/:id" element={<MovieDetailsPage />} />
          <Route path="/movies/:id/cast" element={<CastCrewPage />} />
          <Route
            path="/admin"
            element={user && user.isAdmin ? <AdminPage /> : <AccessDenied />}
          />
          <Route path="/movieRoulette" element={<MovieRoulette />} />          
          
          
        </Routes>
      </UserContext.Provider>
    </>
  );
};



export default App


//TEST FOR DATA PUSH
