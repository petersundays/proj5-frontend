import React, { useState, useEffect } from 'react';
import '../../General/Asides.css';
import Button from '../../General/Button.jsx';
import { AllUsersStore } from '../../../Stores/AllUsersStore.jsx';
import { UserStore } from '../../../Stores/UserStore.jsx';
import { getAllUsers } from '../../../functions/Users/GetAllUsers.js';

function AsideUsers() {

    const DEVELOPER = 100;
    const SCRUM_MASTER = 200;
    const PRODUCT_OWNER = 300;

    const token = UserStore.getState().user.token;
    const [users, setUsers] = useState(AllUsersStore.getState().users);
    const [userSearch, setUserSearch] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [userType, setUserType] = useState(''); 
    const [newUser, setNewUser] = useState('false');
    const [displayContainer, setDisplayContainer] = useState(AllUsersStore.getState().displayContainer); 
    const userLoggedType = UserStore.getState().user.typeOfUser;

    useEffect(() => {
        getAllUsersFromServer(); 
        const unsubscribe = AllUsersStore.subscribe((state) => {
            setUsers(state.users);
        });

        
        return () => unsubscribe();
    }, [selectedUser, userType]);

    const getAllUsersFromServer = async () => {
        try {
            const fetchedUsers = await getAllUsers(token);
            setUsers(fetchedUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
            showErrorMessage('Failed to fetch users. Please try again later.');
        }
    };

    const handleUserSearch = (e) => {
        const searchValue = e.target.value;
        setUserSearch(searchValue);
    
        if (searchValue === '') {
            setSelectedUser('');
        } else {
            const matchingUser = users.find(user => user.username.toLowerCase().includes(searchValue.toLowerCase()));
            if (matchingUser) {
                setSelectedUser(matchingUser.username);
                AllUsersStore.getState().setSelectedUser(matchingUser.username);
            }
        }
    }

    const handleUserChange = (e) => {
        setSelectedUser(e.target.value);
        setUserType(''); 
        AllUsersStore.getState().setSelectedUser(e.target.value);
    }

    const handleUserTypeChange = (e) => {
        setUserType(e.target.value);        
        if (e.target.value !== '') {
            setSelectedUser('');
            AllUsersStore.getState().setSelectedUser('');
        }
    }

    const createSelectOptions = () => {
        if (userSearch === '') {
            return users.map(user => (
                <option key={user.username} value={user.username}>{user.username}</option>
            ));
        } else {
            return users
            .filter(user => user.username.toLowerCase().includes(userSearch.toLowerCase()))
            .map(user => (
                <option key={user.username} value={user.username}>{user.username}</option>
            ));
        }
    }

    const handleNewUser = () => {
        setNewUser('true');
        AllUsersStore.getState().setNewUser(true);
        setDisplayContainer(true);
        AllUsersStore.getState().setDisplayContainer(true);
    }

    return ( 
        <>
            <aside>
                <div className="aside-users-container">
                    <h3 id="addTask-h3">Users</h3>
                    <label className="labels-search-username" id="label-search-username"> Search by username</label>
                    <input type="search" id="search-input" placeholder="User" onChange={handleUserSearch} />
                    <select id="select-username" value={selectedUser} onChange={handleUserChange} required>
                        <option value="">All users</option>
                        {createSelectOptions()} 
                    </select>
                    <div className="spacebetween-users"></div>
                    <label className="labels-user-role" id="label-user-role" hidden={true}> Search by role</label>
                    <select id="user-type" value={userType} onChange={handleUserTypeChange} hidden={true} required>
                        <option value="" >All</option>
                        <option value={DEVELOPER} >Developer</option>
                        <option value={SCRUM_MASTER} >Scrum Master</option>
                        <option value={PRODUCT_OWNER} >Product Owner</option>
                    </select>
                    <Button text="Register New User" width="180px" onClick={handleNewUser} hidden={userLoggedType!==PRODUCT_OWNER}></Button>
                </div>
            </aside>
        </>
    );
}

export default AsideUsers;
