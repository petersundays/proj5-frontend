import { showErrorMessage } from "../Messages/ErrorMessage";

export const getUserByUsername = async ( token , username ) => {

    const getUser = `http://localhost:8080/backend_proj5_war_exploded/rest/users/${username}`;
    try {
        const response = await fetch(getUser, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                token: token
            }
        });
        if (response.ok) {
            const user = await response.json();
            return user;
        } else {
            showErrorMessage('User not found');
            return null;
        }
    }
    catch (error) {
        console.log(error);
        showErrorMessage('User not found');
    }
}