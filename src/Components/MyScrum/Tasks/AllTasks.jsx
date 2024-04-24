import React, { useEffect } from 'react';
import { AllTasksStore } from '../../../Stores/AllTasksStore';
import { getAllTasks } from '../../../functions/Tasks/GetAllTasks';
import TasksContainer from './TasksContainer';
import { UserStore } from '../../../Stores/UserStore';

function AllTasks() {
    const token = UserStore.getState().user.token;

    useEffect(() => {
        getTasks();
    }, []);

    const getTasks = async () => {
        const tasks = await getAllTasks(token);
        AllTasksStore.setState({ tasks: tasks });
    };

    return (
        <TasksContainer />
    );
}

export default AllTasks;