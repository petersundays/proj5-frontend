import React from "react";
import { Route, Routes } from 'react-router-dom';
import "./MainPage.css";
import TasksContainer from "../Tasks/TasksContainer";
import BaseHeader from "./baseHeader";
import Footer from "./Footer";
import EditProfile from "../EditProfile/EditProfile";
import AsideCategories from "../Categories/AsideCategories";

function MainPage() {
    return (
        <>
            <BaseHeader />
            <div className="container" id="container">
                <Routes>
                    <Route path="/" element={<TasksContainer />} />
                    <Route path="edit-profile" element={<EditProfile />} />
                    <Route path="categories" element={<AsideCategories />} />
                </Routes>
            </div>
            <Footer />
        </>
    );
}

export default MainPage;