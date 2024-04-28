import '../../General/Asides.css';
import React, { useEffect, useState } from 'react';
import { UserStore } from '../../../Stores/UserStore';
import { GetAtributedTasks } from '../../../functions/Tasks/GetAtributedTasks';
import { getAtributedTasksByState } from '../../../functions/Tasks/GetAtrributedTasksByState';
import { useParams } from 'react-router-dom';
import Button from '../../../Components/General/Button';
import { showSuccessMessage } from '../../../functions/Messages/SuccessMessage';
import { showErrorMessage } from '../../../functions/Messages/ErrorMessage';


function AsideEditProfile({ photoURL }) {

    const {username: profileUsername} = useParams();
    const usernameLogged = UserStore.getState().user.username;
    const typeOfUser = UserStore.getState().user.typeOfUser;
    const token = UserStore.getState().user.token;

    const TODO = 100;
    const DOING = 200;
    const DONE = 300;

    const PRODUCT_OWNER = 300;

    const [definedTimeout, setDefinedTimeout] = useState(5); 
    const [timeout, setTimeout] = useState(5);

    const [atributedTasks, setAtributedTasks] = useState(0);
    const [toDoTasks, setToDoTasks] = useState(0);
    const [doingTasks, setDoingTasks] = useState(0);
    const [doneTasks, setDoneTasks] = useState(0);

    const handleAtributedTasks = async () => {
        const tasks = await GetAtributedTasks(profileUsername, token);
        setAtributedTasks(tasks);
    }
    
    const handleToDoTasks = async () => {
        const tasks = await getAtributedTasksByState(token, profileUsername, TODO);
        setToDoTasks(tasks);
    }

    const handleDoingTasks = async () => {
        const tasks = await getAtributedTasksByState(token, profileUsername, DOING);
        setDoingTasks(tasks);
    }

    const handleDoneTasks = async () => {
        const tasks = await getAtributedTasksByState(token, profileUsername, DONE);
        setDoneTasks(tasks);
    }

    useEffect(() => {
        handleAtributedTasks();
        handleToDoTasks();
        handleDoingTasks();
        handleDoneTasks();
    }
    , [profileUsername, atributedTasks, toDoTasks, doingTasks, doneTasks]);

    useEffect(() => {
        const fetchTimeout = async () => {
            const timeoutValue = await getTimeout();
            // Only update the timeout state variable if the fetched value is not null or undefined
            if (timeoutValue !== null && timeoutValue !== undefined) {
                setDefinedTimeout(timeoutValue);
            }
        };
    
        fetchTimeout();
    }, []);

    const isProfileOwner = () => {
        return usernameLogged === profileUsername;
    };

    const handleTimeoutChange = (e) => {
        let value = e.target.value;
        if (value === "") {
            setTimeout(5);
        } else {
            value = parseInt(value, 10);
            if (value < 1) {
                value = 1;
            } else if (value > 60) {
                value = 60;
            }
            setTimeout(value);
        }
    }

    const handleSetTimeout = async () => {
        
        const setSessionTimeout = "http://localhost:8080/backend_proj5_war_exploded/rest/users/session/set-timeout";

        try {
            const response = await fetch(setSessionTimeout, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                    token: token,
                    timeout: timeout
                },


            });

            if (response.ok) {
                await getTimeout();
                setTimeout(timeout);
                showSuccessMessage("Session Timeout set successfully");
            } else {
                console.log("Error setting session timeout");
                showErrorMessage("Error setting session timeout");
            }
        } catch (error) {
            console.error("Error:", error);
            showErrorMessage("Something went wrong. Please try again later.");
        }
    }

    const getTimeout = async () => {

        const getSessionTimeout = "http://localhost:8080/backend_proj5_war_exploded/rest/users/session/get-timeout";
            
        try {
            const response = await fetch(getSessionTimeout, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                    token: token,
                },
            });

            if (response.ok) {
                const data = await response.json();
                if (data !== null && data !== undefined) {
                    setDefinedTimeout(data);
                } else {
                    setDefinedTimeout(5);
                }
            } else {
                console.log("Error getting session timeout");
                setDefinedTimeout(5);
            }
        } catch (error) {
            console.error("Error:", error);
            setDefinedTimeout(5);
        }
    }

    return ( 
        <>
            <aside>
                <div className='definitions-div'>
                    {isProfileOwner() ?
                    <div className='language-div'>
                        <img src='../../../../multimedia/flag-portugal.png' alt={t("Portuguese")} />
                        <img src='../../../../multimedia/flag-uk.png' alt={t("English")} />
                    </div>
                    : 
                    null}
                    {isProfileOwner() && typeOfUser === PRODUCT_OWNER ?
                    <>
                    <div className='timeout-div'>
                        <div className="timeout-info">
                            <p id="edit-profile-p-aside">{t('Session Timeout')}</p>
                            <p>{ definedTimeout } {t('minutes')}</p>
                        </div> 
                        <hr /> {/* This will create a horizontal line */}
                        <div className="timeout-set">
                            <p>{t('Set Timeout')}</p>
                            <input type="number" id="timeout-input" value={timeout} onChange={handleTimeoutChange} />                            
                            <Button width='35px' text={t('set')} id="timeout-button" onClick= { () => handleSetTimeout() } >{t('Set')}</Button>
                        </div>
                    </div>
                    
                    </>
                    
                    :
                    null}
                </div>
                <h3 id="username-title-aside">{profileUsername}</h3>
                <img src={photoURL} id="edit-profile-pic-aside" draggable="false" alt={t("Profile Pic")} />
                <div id="edit-profile-tasks-aside">
                    <h3 id="profile-h3-aside">{t('Tasks')}</h3>
                    <label className="labels-profile-aside">{t('Total Atributed')}</label>
                    <p className="info-profile-aside">{atributedTasks}</p>
                    <label className="labels-profile-aside">{t('To Do')}</label>
                    <p className="info-profile-aside">{toDoTasks}</p>
                    <label className="labels-profile-aside">{t('Doing')}</label>
                    <p className="info-profile-aside">{doingTasks}</p>
                    <label className="labels-profile-aside">{t('Done')}</label>
                    <p className="info-profile-aside">{doneTasks}</p>
                    </div>
            </aside>
        </>
    )
}
export default AsideEditProfile;