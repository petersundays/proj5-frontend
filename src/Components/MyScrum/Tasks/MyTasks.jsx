import React, { useEffect, useState } from 'react';
import { MyTasksStore } from '../../../Stores/MyTasksStore';
import { UserStore } from '../../../Stores/UserStore';
import { getTasksFromUser } from '../../../functions/Tasks/GetTasksFromUser';
import TasksContainer from './TasksContainer';

function MyTasks() {
    const token = UserStore.getState().user.token;
    const username = UserStore.getState().user.username;

    const [tasks, setTasks] = useState({ tasks: [] });
    
    useEffect(() => {
        {
            getTasks();
        }

        // Atualiza o estado do componente com o estado do store sempre que a store for atualizado
        const unsubscribe = MyTasksStore.subscribe(
            (newTasks) => {
                setTasks(newTasks);
            },
            (state) => state.tasks,
        );
        

        return () => {
            unsubscribe();
        };
    }, []);


    const getTasks = async () => {
        const tasks = await getTasksFromUser(username, token);
        MyTasksStore.setState({ tasks: tasks });
     };


    return (
        <TasksContainer />
    );
}

export default MyTasks;


