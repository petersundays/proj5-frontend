import React, { useState, useEffect } from 'react';
import '../../General/Asides.css';
import Button from '../../General/Button.jsx';
import { AllUsersStore } from '../../../Stores/AllUsersStore.jsx';
import { UserStore } from '../../../Stores/UserStore.jsx';
import { getAllUsers } from '../../../functions/Users/GetAllUsers.js';
import { useTranslation } from 'react-i18next';

function AsideUsers() {

    const { t } = useTranslation();

    const DEVELOPER = 100;
    const SCRUM_MASTER = 200;
    const PRODUCT_OWNER = 300;

    const token = UserStore.getState().user.token;
    const username = UserStore.getState().user.username;
    const [users, setUsers] = useState(AllUsersStore.getState().users);
    const [userSearch, setUserSearch] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [userType, setUserType] = useState(''); 
    //const [newUser, setNewUser] = useState('false');
    //const [displayContainer, setDisplayContainer] = useState(AllUsersStore.getState().displayContainer); 
    const userLoggedType = UserStore.getState().user.typeOfUser;

    const toggleAside = UserStore((state) => state.toggleAside);

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
                user.username !== username &&
                <option key={user.username} value={user.username}>{user.username}</option>
            ));
        } else {
            return users
            .filter(user => user.username.toLowerCase().includes(userSearch.toLowerCase()))
            .map(user => (
                user.username !== username &&
                <option key={user.username} value={user.username}>{user.username}</option>
            ));
        }
    }

    const handleNewUser = () => {
        //setNewUser('true');
        UserStore.getState().toggleNewUser();
        UserStore.getState().toggleAside();

        //AllUsersStore.getState().setNewUser(true);
        //setDisplayContainer(true);
        //AllUsersStore.getState().setDisplayContainer(true);
        console.log('CLICK isAsideVisible:', UserStore.getState().isAsideVisible);
        console.log('CLICK isNewUserVisible:', UserStore.getState().isNewUserVisible);
    }

    return (
      <>
        <div
          className="offcanvas offcanvas-start"
          tabIndex="-1"
          id="offcanvasExample"
          aria-labelledby="offcanvasExampleLabel"
        >
          <div className="offcanvas-header">
            <h5 id="offcanvasExampleLabel">{t('Users')}</h5>
            <button
              type="button"
              className="btn-close text-reset"
              data-bs-dismiss="offcanvas"
              aria-label={t('Close')}
            ></button>
          </div>
          <div className="offcanvas-body">
            <div className="aside-users-container">
              <h3 id="addTask-h3">{t('Users')}</h3>
              <label className="labels-search-username" id="label-search-username">
                {t('Search by username')}
              </label>
              <input
                type="search"
                id="search-input"
                placeholder={t('User')}
                onChange={handleUserSearch}
              />
              <select
                id="select-username"
                value={selectedUser}
                onChange={handleUserChange}
                required
              >
                <option value="">{t('All users')}</option>
                {createSelectOptions()}
              </select>
              <div className="spacebetween-users"></div>
              <label
                className="labels-user-role"
                id="label-user-role"
                hidden={true}
              >
                {t('Search by role')}
              </label>
              <select
                id="user-type"
                value={userType}
                onChange={handleUserTypeChange}
                hidden={true}
                required
              >
                <option value="">{t('All')}</option>
                <option value={DEVELOPER}>{t('Developer')}</option>
                <option value={SCRUM_MASTER}>{t('Scrum Master')}</option>
                <option value={PRODUCT_OWNER}>{t('Product Owner')}</option>
              </select>
              <Button
                text={t('Register New User')}
                width="180px"
                onClick={handleNewUser}
                hidden={userLoggedType !== PRODUCT_OWNER}
              ></Button>
            </div>
          </div>
        </div>
      </>
    );
  }
export default AsideUsers;
