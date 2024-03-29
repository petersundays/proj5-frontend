import React from "react";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import RegisterPage from "./Pages/RegisterPage";
import MainPage from "./Pages/MainPage";

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/my-scrum/*" element={<MainPage />} />
            </Routes>
            <ToastContainer />
        </>
    );
}

export default App;