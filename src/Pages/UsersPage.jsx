import React from "react";
import AsideUsers from "../Components/MyScrum/Users/AsideUsers";
import { UserDetails } from "../Components/MyScrum/Users/UserDetails";
import UsersContainer from "../Components/MyScrum/Users/UsersContainer";
import { useNavigate } from "react-router-dom";
import { UserStore } from "../Stores/UserStore";

function UsersPage() {
    const user = UserStore.getState().user; 
    const navigate = useNavigate();

    const isNewUserVisible = UserStore((state) => state.isNewUserVisible);

    if (!user) {
        navigate('/');
    } 
    return (
        <>

                <AsideUsers />
                <UsersContainer />
                {isNewUserVisible && <UserDetails /> }

                
                              
        </>
    );
}

export default UsersPage;