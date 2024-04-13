import { showErrorMessage } from "../Messages/ErrorMessage";

export const SetPassword = async (e, token, password, confirmPassword) => {

    e.preventDefault();

    if (password !== confirmPassword) {
        showErrorMessage('Passwords do not match');
        return;
    }
    
    const definePassword = "http://localhost:8080/backend_proj5_war_exploded/rest/users/set/password";

    try {
        const response = await fetch(definePassword, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                validationToken: token,
                password: password,
            },
           
        });

        if (response.ok) {
            return true;
        } else {
            console.log('Error setting password');
            return false;
        }
    }
    catch (error) {
        console.log(error);
        return false;
    }
}