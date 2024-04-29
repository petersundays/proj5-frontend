import React, { useState, useEffect } from 'react';
import Button from '../../General/Button.jsx';
import { UserStore } from '../../../Stores/UserStore.jsx';
import { showErrorMessage } from '../../../functions/Messages/ErrorMessage.js';
import { showSuccessMessage } from '../../../functions/Messages/SuccessMessage.js';
import { getAllUsers } from '../../../functions/Users/GetAllUsers.js';
import { getTasksFromUser } from '../../../functions/Tasks/GetTasksFromUser.js';
import { AllTasksStore } from '../../../Stores/AllTasksStore.jsx';
import { getAllTasks } from '../../../functions/Tasks/GetAllTasks.js';
import { ConfirmationModal } from '../../General/ConfirmationModal.jsx';
import { StatisticsStore } from '../../../Stores/StatisticsStore.jsx';
import { useTranslation } from 'react-i18next';

function AsideAllTasks() {

    const { t } = useTranslation();

    const token = UserStore.getState().user.token;
    
    const [userSearch, setUserSearch] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');

    const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
    const message = "Are you sure you want to delete this tasks?";
    
    const { sendMessage } = StatisticsStore((state) => ({ sendMessage: state.sendMessage }));

    //const isAsideVisible = UserStore((state) => state.isAsideVisible);

   
    useEffect(() => {
        getAllUsersFromServer(); 
    }, []);

    useEffect(() => {
        async function fetchTasks() {
            if (selectedUser !== '' && selectedUser !== 'erased') {
                const selectedUsersTasks = await getTasksFromUser(selectedUser, token);
                AllTasksStore.setState({ tasks: selectedUsersTasks });
            } else if (selectedUser !== 'erased') {
                const allTasks = await getAllTasks(token);
                AllTasksStore.setState({ tasks: allTasks });
            }
        }
        fetchTasks();
    }, [selectedUser]);

    const getAllUsersFromServer = async () => {
        try {
            const fetchedUsers = await getAllUsers(token);
            setUsers(fetchedUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
            showErrorMessage('Failed to fetch users. Please try again later.');
        }
    };

    const handleDisplayConfirmationModal = () => {
        
        setDisplayConfirmationModal(!displayConfirmationModal);
    }
    

    const handleUserSearch = (e) => {
        const searchValue = e.target.value;
        setUserSearch(searchValue);
    
        if (searchValue === '') {
            setSelectedUser('');
        } else {
            const matchingUser = users.find(user => user.username.toLowerCase().includes(searchValue.toLowerCase()));
            if (matchingUser) {
                setSelectedUser(matchingUser.username);
            }
        }
    }

    const handleUserChange = async (e) => {
        setSelectedUser(e.target.value);
        if (e.target.value === 'erased') {
            await showErasedTasks();
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


    const showErasedTasks = async () => {
        const erasedTasks = await getErasedTasks();
        AllTasksStore.setState({ tasks: erasedTasks });
        
    }

    const handleDeleteAllTasks = async () => {

        if (selectedUser === 'erased') {
           deleteAllErasedTasks();
           setDisplayConfirmationModal(false);
           sendMessage();
        } else if (selectedUser !== '') {
            deleteAllTasksFromUser();
            setDisplayConfirmationModal(false);
        } else {
            showErrorMessage('Please select a user to delete tasks.');
            setDisplayConfirmationModal(false);
        }
    }

    const handleRestoreAllTasks = async () => {
        if (selectedUser === 'erased') {
            await restoreAllTasks();
            sendMessage();
        } else if (selectedUser !== '') {
            await restoreAllTasksFromUser();
        } else {
            showErrorMessage('Please select a user to restore tasks.');
        }
    }

    const handleEraseAllTasks = async () => {
        if (selectedUser === 'erased') {
           showErrorMessage('The selected tasks are already erased.');
        } else if (selectedUser !== '') {
            await eraseAllTasksFromUser();
        } else {
            await eraseAllTasks();
        }
    }

    const getErasedTasks = async () => {
        const getErasedTasks = `http://localhost:8080/backend_proj5_war_exploded/rest/tasks/erased`;
        try {
            const response = await fetch(getErasedTasks, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    token: token
                }
            });
            if (response.ok) {
                const erasedTasks = await response.json();
                return erasedTasks;
            } else {
                showErrorMessage('Failed to fetch erased tasks. Please try again later.');
            }
        } catch (error) {
            console.error('Error fetching erased tasks:', error);
            showErrorMessage('Failed to fetch erased tasks. Please try again later.');
        }
    }


    const eraseAllTasks = async () => {

        const eraseAll = `http://localhost:8080/backend_proj5_war_exploded/rest/tasks/erase-all`;
        try {
            const response = await fetch(eraseAll, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    token: token
                }
            });
            if (response.ok) {
                showSuccessMessage('Tasks erased successfully.');
                const updatedTasks = await getAllTasks(token);
                AllTasksStore.setState({ tasks: updatedTasks });
                sendMessage();
            } else {
                showErrorMessage('Failed to erase tasks. Please try again later.');
            }
        } catch (error) {
            console.error('Error erasing tasks:', error);
            showErrorMessage('Something went wrong. Please try again later.');
        }
    }

    
    const eraseAllTasksFromUser = async () => {


        const eraseAllFromUser = `http://localhost:8080/backend_proj5_war_exploded/rest/tasks/erase-all/${selectedUser}`;
        try {
            const response = await fetch(eraseAllFromUser, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    token: token
                }
            });
            if (response.ok) {
                showSuccessMessage('Tasks from ' + selectedUser.toUpperCase() + ' erased successfully.');
                const updatedTasks = await getTasksFromUser(selectedUser, token);
                AllTasksStore.setState({ tasks: updatedTasks });
                sendMessage();
            } else {
                showErrorMessage('Failed to erase tasks. Please try again later.');
            }
        } catch (error) {
            console.error('Error erasing tasks:', error);
            showErrorMessage('Something went wrong. Please try again later.');
        }

    
    }

    const restoreAllTasks = async () => {

        if (selectedUser === 'erased') {
            const restoreAll = `http://localhost:8080/backend_proj5_war_exploded/rest/tasks/restore-all`;
            try {
                const response = await fetch(restoreAll, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': '*/*',
                        token: token
                    }
                });
                if (response.ok) {
                    showSuccessMessage('Tasks restored successfully.');
                    const updatedTasks = await getErasedTasks();
                    AllTasksStore.setState({ tasks: updatedTasks });
                    sendMessage();
                } else {
                    showErrorMessage('Failed to restore tasks. Please try again later.');
                }
            } catch (error) {
                console.error('Error restoring tasks:', error);
                showErrorMessage('Something went wrong. Please try again later.');
            }
        }
    }


    const restoreAllTasksFromUser = async () => {

        if (selectedUser === '') {
            showErrorMessage('Please select a user to restore tasks.');
            return;
        } else {
            const eraseAll = `http://localhost:8080/backend_proj5_war_exploded/rest/tasks/restore-all/${selectedUser}`;
            try {
                const response = await fetch(eraseAll, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': '*/*',
                        token: token
                    }
                });
                if (response.ok) {
                    showSuccessMessage('Tasks from ' + selectedUser.toUpperCase() + ' restored successfully.');
                    const updatedTasks = await getTasksFromUser(selectedUser, token);
                    AllTasksStore.setState({ tasks: updatedTasks });
                    sendMessage();
                } else {
                    showErrorMessage('Failed to restore all tasks. Please try again later.');
                }
            } catch (error) {
                console.error('Error restoring tasks:', error);
                showErrorMessage('Something went wrong. Please try again later.');
            }

        }
    }

    const deleteAllTasksFromUser = async () => {

        const deleteAllFromUser = `http://localhost:8080/backend_proj5_war_exploded/rest/tasks/${selectedUser}`; 
        try {
            const response = await fetch(deleteAllFromUser, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    token: token
                }
            });
            if (response.ok) {
                showSuccessMessage('Tasks deleted successfully.');
                const updatedTasks = await getTasksFromUser(selectedUser, token);
                AllTasksStore.setState({ tasks: updatedTasks });
                sendMessage();
            } else {
                showErrorMessage('Failed to delete tasks. Please try again later.');
            }
        } catch (error) {
            console.error('Error deleting tasks:', error);
            showErrorMessage('Something went wrong. Please try again later.');
        }
    }

   
    const deleteAllErasedTasks = async () => {

        const deleteAll = `http://localhost:8080/backend_proj5_war_exploded/rest/tasks/`;
        try {
            const response = await fetch(deleteAll, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    token: token
                }
            });
            if (response.ok) {
                showSuccessMessage('Tasks deleted successfully.');
                AllTasksStore.setState({ tasks: [] });
                sendMessage();
            } else {
                showErrorMessage('Failed to delete tasks. Please try again later.');
            }
        } catch (error) {
            console.error('Error deleting tasks:', error);
            showErrorMessage('Something went wrong. Please try again later.');
        }
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
              <h5 id="offcanvasExampleLabel">{t('All Tasks')}</h5>
              <button
                type="button"
                className="btn-close text-reset"
                data-bs-dismiss="offcanvas"
                aria-label={t('Close')}
              ></button>
            </div>
            <div className="offcanvas-body">
              <ConfirmationModal
                onConfirm={handleDeleteAllTasks}
                onCancel={handleDisplayConfirmationModal}
                message={message}
                displayModal={displayConfirmationModal}
              />
              <div className="add-task-container">
                <h3 id="categories-h3">{t('Search Tasks')}</h3>
                <input
                  type="search"
                  id="search-category"
                  placeholder={t('User')}
                  onChange={handleUserSearch}
                />
                <select
                  id="task-category"
                  value={selectedUser}
                  onChange={handleUserChange}
                  required
                >
                  <option value="">{t('All Tasks')}</option>
                  <option value="erased">{t('Erased Tasks')}</option>
                  {createSelectOptions()}
                </select>
                <div id="category-buttons-container">
                  <Button
                    text={t('Erase All')}
                    width="94px"
                    onClick={handleEraseAllTasks}
                  ></Button>
                  <Button
                    text={t('Restore All')}
                    width="94px"
                    onClick={handleRestoreAllTasks}
                  ></Button>
                  <Button
                    text={t('Delete All')}
                    width="94px"
                    onClick={handleDisplayConfirmationModal}
                  ></Button>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }
export default AsideAllTasks;
