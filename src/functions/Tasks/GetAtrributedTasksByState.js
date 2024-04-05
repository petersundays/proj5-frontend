export async function getAtributedTasksByState(token, username, stateId) {
    
    const atributedTasks = `http://localhost:8080/backend_proj5_war_exploded/rest/tasks/${username}/${stateId}`;
    try {
        const response = await fetch(atributedTasks, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "*/*",
                token: token,
            },
        });

        if (response.ok) {
            const tasks = await response.json();
            return tasks;
        } else {
            const error = await response.text();
            console.log("Error: " + error);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}