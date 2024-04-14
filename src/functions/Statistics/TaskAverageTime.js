export const AverageTimeToFinishTask = async (token) => {

    const getStats = "http://localhost:8080/backend_proj5_war_exploded/rest/tasks/average";

    try {
        const response = await fetch(getStats, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                token: token
            }
        });

        if (response.ok) {
            const stats = await response.json();
            return stats;
        } else {
            return 0;
        }
    } catch (error) {
        console.log(error);
    }
}