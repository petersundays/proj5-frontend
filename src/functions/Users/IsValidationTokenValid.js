import { showErrorMessage } from "../Messages/ErrorMessage";

export const IsValidationTokenValid = async (token) => {

    console.log("TOKEEEEEEEN ",token);
    
    const valid = 'http://localhost:8080/backend_proj5_war_exploded/rest/users/validate-token';

    try {
        const response = await fetch(valid, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                validationToken: token
            }
        });
        if (response.ok) {
            const isValid = await response.json();
            return isValid;
        } else {
            showErrorMessage('Invalid credentials')
            return false;
        }
    }
    catch (error) {
        console.log(error);
        return false;
    }
}