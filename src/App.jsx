import React from "react";
import "./App.css";
import { ToastContainer } from "react-toastify";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import RegisterPage from "./Pages/RegisterPage";
import MainPage from "./Pages/MainPage";
import NotConfirmedPage from "./Pages/NotConfirmedPage";
import ConfirmAccountPage from "./Pages/ConfirmAccountPage";
import RecoverPasswordPage from "./Pages/RecoverPasswordPage";
import ResetPasswordPage from "./Pages/ResetPasswordPage";

function App() {

  
    return (
        <>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/my-scrum/*" element={<MainPage />} />
                <Route path="/account-not-confirmed" element={<NotConfirmedPage />} />
                <Route path="/confirm/:validationToken" element={<ConfirmAccountPage />} />
                <Route path="/recover-password" element={<RecoverPasswordPage />} />
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            </Routes>
            <ToastContainer />
        </>
    );
}

export default App;