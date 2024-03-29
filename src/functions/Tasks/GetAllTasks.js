
export const getAllTasks = async (token) => {

        const getTasks = "http://localhost:8080/proj5_backend_war_exploded/rest/tasks";
        try {
            const response = await fetch(getTasks, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    token: token
                }
            });
            if (response.ok) {
                const tasks = await response.json();
                return tasks;
            } else {
                return [];
            }
        }
        catch (error) {
            console.log(error);
        }

    }

