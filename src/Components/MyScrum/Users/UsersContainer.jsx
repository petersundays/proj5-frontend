import './UsersContainer.css';
import { useEffect, useState } from 'react';
import { UserStore } from '../../../Stores/UserStore';
import { useNavigate } from "react-router-dom";
import { AllUsersStore } from '../../../Stores/AllUsersStore';
import { ConfirmationModal } from '../../General/ConfirmationModal';
import { UserDetails } from './UserDetails';
import { showSuccessMessage } from '../../../functions/Messages/SuccessMessage.js';
import { showErrorMessage } from '../../../functions/Messages/ErrorMessage.js';
import { getUserByUsername } from '../../../functions/Users/GetUserByUsername.js';
import { StatisticsStore } from '../../../Stores/StatisticsStore.jsx';
import { useTranslation } from 'react-i18next';


function UsersContainer() {

    const navigate = useNavigate();

    const { t } = useTranslation();

    const token = UserStore.getState().user.token;
    const userLoggedType = UserStore.getState().user.typeOfUser;
    const username = UserStore.getState().user.username;
    const { sendMessage } = StatisticsStore((state) => ({ sendMessage: state.sendMessage }));

    const DEVELOPER = 100;
    const SCRUM_MASTER = 200;
    const PRODUCT_OWNER = 300;

    //const [displayContainer, setDisplayContainer] = useState(false);
    //const [newUser, setNewUser] = useState(AllUsersStore.getState().newUser);
    const [users, setUsers] = useState(AllUsersStore.getState().users);
    const [selectedUser, setSelectedUser] = useState(AllUsersStore.getState().selectedUser);
    const [userType, setUserType] = useState(AllUsersStore.getState().userType);

    const isNewUserVisible = UserStore((state) => state.isNewUserVisible);

    const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState({});
    const message = "Are you sure you want to permanently delete this user?";

   
    
    useEffect(() => {
        AllUsersStore.getState().setUserType(userType);
    }, [userType]);
    useEffect(() => {
        const unsubscribe = AllUsersStore.subscribe((state) => {
            setUsers(state.users);
            setSelectedUser(state.selectedUser);
            setUserType(state.userType);
           // setNewUser(state.newUser);
            //setDisplayContainer(state.displayContainer);
        });
    
        return () => unsubscribe();
    }, []);


    const handleRowClick = (username) => {
        navigate(`/my-scrum/profile/${username}`);
    }
    

    const handleDisplayConfirmationModal = (e, user) => {
        e.stopPropagation();
        setUserToDelete(user);
        setDisplayConfirmationModal(!displayConfirmationModal);
    }

    const handleVisibilityButton = async (e, user) => {
        e.stopPropagation();
        changeVisibilityOfUser(user);
    }

    const handleDeleteButton = async (e) => {
        e.stopPropagation();
        await permenantlyDeleteUser(userToDelete);
    }


    const convertTypeOfUserToString = (type) => {
        switch (type) {
            case DEVELOPER:
                return 'Developer';
            case SCRUM_MASTER:
                return 'Scrum Master';
            case PRODUCT_OWNER:
                return 'Product Owner';
            default:
                return 'Undefined';
        }
    }

    const getUsersToDisplay = () => {
        let filteredUsers = users;      
    
        if (selectedUser !== '') {
            filteredUsers = filteredUsers.filter(user => user.username === selectedUser);
        }
    
        if (userType !== '') {
            filteredUsers = filteredUsers.filter(user => user.typeOfUser === userType);
        }
    
        return filteredUsers.map(user => (
            user.username !== username &&
            <tr key={user.username} onClick={() => handleRowClick(user.username)}>
                <td><img src={user.photoURL} alt="" /></td>
                <td>{user.username}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                { userLoggedType === PRODUCT_OWNER && 
                <>
                    <td>{user.email}</td>
                    <td>{convertTypeOfUserToString(user.typeOfUser)}</td>
                    <td>{user.numberOfTasks}</td>
                    <td>
                        <div className='buttons-container'>
                            <img src={user.visible ? '../../../multimedia/hide.png' : '../../../multimedia/show.png' } id="hide-show" onClick={(e) => handleVisibilityButton(e, user)} />
                            <img src='../../../multimedia/deleteUser.png' id="hide-show" hidden={user.visible ? true : false} onClick={(e) => handleDisplayConfirmationModal(e, user)} />
                        </div>
                    </td>
                </>
                }
            </tr>
        ));
    }


    const changeVisibilityOfUser = async (user) => {
       
        const username = user.username;

        const changeVisibility = `http://localhost:8080/backend_proj5_war_exploded/rest/users/${username}/visibility`;

        try {
            const response = await fetch(changeVisibility, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    token: token
                }
            });

            if (response.ok) {
                const feedback = await response.text();
                const updatedUser = await getUserByUsername(token, username);
                showSuccessMessage(feedback);
                sendMessage();
                AllUsersStore.getState().updateUser(updatedUser);
                AllUsersStore.getState().setDisplayContainer(false);

            } else {
                console.log('Error', response.text());
                showErrorMessage("Failed to change user's visibility. Please try again later.");
            }
        }
        catch (error) {
            console.log(error);
            showErrorMessage("Failed to change user's visibility. Please try again later.");
        }
    }
 

    const permenantlyDeleteUser = async (user) => {
        const username = user.username;
        const deleteUser = `http://localhost:8080/backend_proj5_war_exploded/rest/users/${username}`;

        try {
            const response = await fetch(deleteUser, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    token: token
                }
            });

            if (response.ok) {
                const feedback = await response.text();
                showSuccessMessage(feedback);
                sendMessage();
                AllUsersStore.getState().removeUser(username);
                //AllUsersStore.getState().setDisplayContainer(false);
                AllUsersStore.getState().setDisplayConfirmationModal(false);
            } else {
                console.log('Error', response.status);
                showErrorMessage("Failed to delete user. Please try again later.");
            }
        }
        catch (error) {
            console.log(error);
            showErrorMessage("Failed to delete user. Please try again later.");
        }
    }

    return (
        <>
            <main className="main-users">
                <div className="details-editProfile">
                    <div className="container-table">
                    <div className="container-table table-responsive">
                        <table className="table">
                            <thead>
                                <tr className="table-header">
                                    <th></th>
                                    <th>{t('Username')}</th>
                                    <th>{t('First Name')}</th>
                                    <th>{t('Last Name')}</th>
                                    { userLoggedType === PRODUCT_OWNER &&
                                        <>
                                            <th>{t('Email')}</th>
                                            <th>{t('Role')}</th>
                                            <th>{t('#Tasks')}</th>
                                            <th>{t('Actions')}</th>
                                        </>
                                    }
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {getUsersToDisplay()}
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>
            </main>
            <ConfirmationModal onConfirm={handleDeleteButton} onCancel={handleDisplayConfirmationModal} message={t('Are you sure you want to permanently delete this user?')} displayModal={displayConfirmationModal}  />
        </>
    )
}
export default UsersContainer;
