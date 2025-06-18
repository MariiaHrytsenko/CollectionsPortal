import { Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import Er404 from "../pages/Er404";
import Home from "../pages/Home";
/*import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import Register from "../pages/Register";
import BikeList from "../pages/BikeList";
import { isAuthenticated } from "../components/authService";
import BikeDetails from "../pages/BikeDetails";
import MyReservations from "../pages/MyReservations";

*/
const PrivateRoute = ({ element }: { element: React.JSX.Element }) => {
 // return isAuthenticated() ? element : <Navigate to="/login" />;
};

const AppRouter = () => {
  return (/*
    <Routes>
      
      
      <Route path="/about" element={<PrivateRoute element={<About />} />} />
      <Route path="/contact" element={<PrivateRoute element={<Contact />} />} />
      <Route path="/myreservations" element={<PrivateRoute element={<MyReservations/>}/>}/>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} /> {}
      <Route path="/bikelist" element={<BikeList />} />
      <Route path="/bike/:id" element={<BikeDetails/>}/>
    </Routes>*/
    <Routes>
      <Route path="*" element={<Er404 />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
  };

export default AppRouter;
