import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import '../Components/MyScrum/Main/MainPage.css';
import BaseHeader from '../Components/MyScrum/Main/baseHeader';
import Footer from '../Components/MyScrum/Main/Footer';
import CategoriesPage from './CategoriesPage';
import MyTasksPage from './MyTasksPage';
import AllTasksPage from './AllTasksPage';
import EditProfilePage from './EditProfilePage';
import EditTaskPage from './EditTaskPage';
import UsersPage from './UsersPage';
import { UserStore } from '../Stores/UserStore';

function MainPage() {
    const user = UserStore.getState().user; 
    const navigate = useNavigate();

    if (!user) {
        navigate('/');
    } 

    return (
        <>
            <BaseHeader />
            <div className="container" id="container">
                <Routes>
                    <Route path="/" element={< MyTasksPage />} />
                    <Route path="edit-profile" element={<EditProfilePage />} />
                    <Route path="categories" element={<CategoriesPage />} />
                    <Route path="all-tasks" element={<AllTasksPage />} />
                    <Route path="users" element={<UsersPage />} />
                    <Route path="edit-task" element={<EditTaskPage />} />

                </Routes>
            </div>
            <Footer />
        </>
    );
}

export default MainPage;