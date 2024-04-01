import '../../General/Asides.css';
import React, { useEffect, useState } from 'react';
import { UserStore } from '../../../Stores/UserStore';
import { GetAtributedTasks } from '../../../functions/Tasks/GetAtributedTasks';
import { getAtributedTasksByState } from '../../../functions/Tasks/GetAtrributedTasksByState';


function AsideEditProfile({ photoURL }) {
    const username = UserStore.getState().user.username;
    const token = UserStore.getState().user.token;

    const TODO = 100;
    const DOING = 200;
    const DONE = 300;

    const [atributedTasks, setAtributedTasks] = useState(0);
    const [toDoTasks, setToDoTasks] = useState(0);
    const [doingTasks, setDoingTasks] = useState(0);
    const [doneTasks, setDoneTasks] = useState(0);

    const handleAtributedTasks = async () => {
        const tasks = await GetAtributedTasks(username, token);
        setAtributedTasks(tasks);
    }
    
    const handleToDoTasks = async () => {
        const tasks = await getAtributedTasksByState(token, username, TODO);
        setToDoTasks(tasks);
    }

    const handleDoingTasks = async () => {
        const tasks = await getAtributedTasksByState(token, username, DOING);
        setDoingTasks(tasks);
    }

    const handleDoneTasks = async () => {
        const tasks = await getAtributedTasksByState(token, username, DONE);
        setDoneTasks(tasks);
    }

    useEffect(() => {
        handleAtributedTasks();
        handleToDoTasks();
        handleDoingTasks();
        handleDoneTasks();
    }
    , [atributedTasks, toDoTasks, doingTasks, doneTasks]);


    return ( 

        <>
            <aside>
                <div className='language-div'>
                    <img src='../../../../multimedia/flag-portugal.png' alt="Portuguese" />
                    <img src='../../../../multimedia/flag-uk.png' alt="English" />
                </div>
                <h3 id="username-title-aside">{username}</h3>
                <img src={photoURL} id="edit-profile-pic-aside" draggable="false" alt="Profile Pic" />
                <div id="edit-profile-tasks-aside">
                    <h3 id="profile-h3-aside">Tasks</h3>
                    <label className="labels-profile-aside">Total Atributed</label>
                    <p className="info-profile-aside">{atributedTasks}</p>
                    <label className="labels-profile-aside">To Do</label>
                    <p className="info-profile-aside">{toDoTasks}</p>
                    <label className="labels-profile-aside">Doing</label>
                    <p className="info-profile-aside">{doingTasks}</p>
                    <label className="labels-profile-aside">Done</label>
                    <p className="info-profile-aside">{doingTasks}</p>
                    </div>
            </aside>
        </>
    )
}
export default AsideEditProfile;