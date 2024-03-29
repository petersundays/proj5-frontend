import React from "react";
import TasksContainer from '../Components/MyScrum/Tasks/TasksContainer';
import AsideCategories from "../Components/MyScrum//Categories/AsideCategories";
import { UserStore } from "../Stores/UserStore";
import { useNavigate } from "react-router-dom";

function CategoriesPage() {

    const navigate = useNavigate();
    const DEVELOPER = 100;
    const SCRUM_MASTER = 200;
    const PRODUCT_OWNER = 300;

    if (!UserStore.getState().user) {
        navigate('/');
    } else {
        if (UserStore.getState().user.typeOfUser !== PRODUCT_OWNER) {
            navigate('/my-scrum/tasks');
        }
    }


    return (
        <>

                <AsideCategories />
                <TasksContainer />
                              
        </>
    );
}

export default CategoriesPage;