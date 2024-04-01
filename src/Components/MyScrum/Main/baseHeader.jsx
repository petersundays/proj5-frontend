import React from 'react';
import { Link } from "react-router-dom";
import './baseHeader.css';
import { UserStore } from '../../../Stores/UserStore';
import { MyTasksStore } from '../../../Stores/MyTasksStore';
import { CategoriesStore } from '../../../Stores/CategoriesStore';
import { useNavigate } from 'react-router-dom';
import { AllTasksStore } from '../../../Stores/AllTasksStore';
import { showInfoMessage } from '../../../functions/Messages/InfoMessage';
import { AllUsersStore } from '../../../Stores/AllUsersStore';
import { TasksByCategoryStore } from '../../../Stores/TasksByCategoryStore';
import { TasksByUserStore } from '../../../Stores/TasksByUserStore';


function BaseHeader() {
    const token = UserStore.getState().user.token;

    let firstName = "";
    if (UserStore.getState().user.firstName !== undefined) {
        firstName = UserStore.getState().user.firstName;
    } else {
        firstName = "First Name";
    }

    let 
    photoURL = "";
    if (UserStore.getState().user.photoURL !== undefined) {
        photoURL = UserStore.getState().user.photoURL;
    } else {
        photoURL = "multimedia/user-avatar.jpg";
    }

    const DEVELOPER = 100;
    const SCRUM_MASTER = 200;
    const PRODUCT_OWNER = 300;

    const typeOfUser = UserStore.getState().user.typeOfUser;
    const userConfirmed = UserStore.getState().user.confirmed;  

    const navigate = useNavigate();

    const handleLogout = async () => {
        UserStore.setState({ user: {} });
        MyTasksStore.setState({ tasks: [] });
        CategoriesStore.setState({ categories: [] });
        AllTasksStore.setState({ tasks: [] });
        AllUsersStore.setState({ users: [] });
        AllUsersStore.setState({ selectedUser: "" });
        AllUsersStore.setState({ userType: "" });
        AllUsersStore.setState({ newUser: false });
        AllUsersStore.setState({ displayContainer: false });
        TasksByCategoryStore.setState({ tasks: [] });
        TasksByUserStore.setState({ tasks: [] });

        const logout = "http://localhost:8080/proj5_backend_war_exploded/rest/users/logout";
        try {
            const response = await fetch(logout, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                    token: token,
                },
            });

            if (response.ok) {
                showInfoMessage("Thank you for using Agile Scrum. See you soon!");
            } else {
                const error = await response.text();
                console.log("Error: " + error);
            }
        } catch (error) {
            console.error("Error:", error);
        } 

        navigate('/');
    };


    return (
        <>
            <header>
                <img src='/multimedia/logo-scrum-05.png' id="logo-header" height="50" draggable="false"/>
                <nav className="nav-menu-left">
                    <ul id="menu">
                        {userConfirmed === true ?
                            <>
                            <li id="nav-home"><Link to="/my-scrum" draggable="false">My Tasks</Link></li>
                            <li id="nav-all-tasks"><Link to="/my-scrum/all-tasks" draggable="false">All Tasks</Link></li>
                            <li id="nav-categories"><Link to="/my-scrum/users" draggable="false" hidden={typeOfUser === DEVELOPER}>Users</Link></li>
                            <li id="nav-categories"><Link to="/my-scrum/categories" draggable="false" hidden={typeOfUser !== PRODUCT_OWNER}>Categories</Link></li>
                            </>
                        :
                            <li></li>
                        }
                    </ul>
                </nav>
                <div className="nav-menu-right">
                    <img src={photoURL} id="profile-pic" draggable="false"/>
                    {userConfirmed === true ? 
                        <Link to="/my-scrum/edit-profile" id="first-name-label" draggable="false" >{firstName}</Link>
                    :
                        <p id="first-name-label" draggable="false" >{firstName}</p>
                    }
                    <button className="logout-button" id="logout-button-header" onClick={handleLogout}>
                        <img src="/multimedia/logout.png" alt="Logout Icon" draggable="false"/>
                        Logout
                    </button>
                </div>
            </header>
          
        </>
    );
}
export default BaseHeader; 