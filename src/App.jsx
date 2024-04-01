import React from "react";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import RegisterPage from "./Pages/RegisterPage";
import MainPage from "./Pages/MainPage";
import NotConfirmedPage from "./Pages/NotConfirmedPage";

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/my-scrum/*" element={<MainPage />} />
                <Route path="/account-not-confirmed" element={<NotConfirmedPage />} />
            </Routes>
            <ToastContainer />
        </>
    );
}

export default App;