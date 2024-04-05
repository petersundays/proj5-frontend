import { showErrorMessage } from "../Messages/ErrorMessage";
import { TasksByCategoryStore } from "../../Stores/TasksByCategoryStore";

export const getTasksByCategory = async ( selectedCategory , token ) => {
 
    const tasksByCategory = `http://localhost:8080/backend_proj5_war_exploded/rest/categories/${selectedCategory}`;
    try {
        const response = await fetch(tasksByCategory, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                token: token
            },
        });

        if (response.ok) {
            const tasks = await response.json();
            TasksByCategoryStore.setState({ tasks: tasks });
            return tasks;
        } else {
            const error = await response.text();
            showErrorMessage('Error: ' + error);
        }
    } catch (error) {
        console.error('Error:', error);
        showErrorMessage('Something went wrong. Please try again later.');
    }
}