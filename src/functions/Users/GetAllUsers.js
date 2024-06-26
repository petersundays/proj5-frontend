import { AllUsersStore } from "../../Stores/AllUsersStore";
export const getAllUsers = async ( token ) => {

    const getUsers = "http://localhost:8080/backend_proj5_war_exploded/rest/users";
    try {
        const response = await fetch(getUsers, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                token: token
            }
        });
        if (response.ok) {
            const users = await response.json();
            AllUsersStore.setState({ users: users });
            return users;
        } else {
            return [];
        }
    }
    catch (error) {
        console.log(error);
    }
}