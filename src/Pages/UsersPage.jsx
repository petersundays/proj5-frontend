import React from "react";
import AsideUsers from "../Components/MyScrum/Users/AsideUsers";
import UsersContainer from "../Components/MyScrum/Users/UsersContainer";
import { useNavigate } from "react-router-dom";
import { UserStore } from "../Stores/UserStore";

function UsersPage() {
    const user = UserStore.getState().user; 
    const navigate = useNavigate();

    if (!user) {
        navigate('/');
    } 
    return (
        <>

                <AsideUsers />
                <UsersContainer />
                
                              
        </>
    );
}

export default UsersPage;