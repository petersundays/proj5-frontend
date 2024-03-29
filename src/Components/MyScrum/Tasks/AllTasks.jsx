import React, { useEffect, useState } from 'react';
import { AllTasksStore } from '../../../Stores/AllTasksStore';
import { getAllTasks } from '../../../functions/Tasks/GetAllTasks';
import TasksContainer from './TasksContainer';
import { UserStore } from '../../../Stores/UserStore';

function AllTasks() {

    const token = UserStore.getState().user.token;
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        getTasks();

        const unsubscribe = AllTasksStore.subscribe(
            (newTasks) => {
                setTasks(newTasks);
            },
            (state) => state.tasks
        );

        return () => {
            unsubscribe();
        };
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
