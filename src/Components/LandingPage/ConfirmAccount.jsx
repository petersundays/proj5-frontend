import './ConfirmAccount.css';
import { useState } from "react";
import { useParams } from "react-router-dom";
import { showErrorMessage } from "../../functions/Messages/ErrorMessage";
import { useNavigate } from "react-router-dom";
import { showSuccessMessage } from "../../functions/Messages/SuccessMessage";
import Button from '../General/Button';

export function ConfirmAccount() {

    const navigate = useNavigate();

    const {email} = useParams();

    const [passwordData, setPasswordData] = useState({
        password: '',
        confirmPassword: ''
    });

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
    };

    const handlePasswordSetAndConfirmAccount = async (e) => {
        e.preventDefault();
        if (await setNewPassword(e)) {
            if (await confirmUser()) {
                showSuccessMessage('Account confirmed');
                navigate('/');
            }
        }
    };

    const handleCancelButton = () => {
        console.log('Cancel');
        navigate('/');
    };

    const setNewPassword = async (e) => {
        e.preventDefault();

        if (passwordData.password !== passwordData.confirmPassword) {
            showErrorMessage('Passwords do not match');
            return;
        }
       
        const changePassword = "http://localhost:8080/backend_proj5_war_exploded/rest/users/set/password";

        try {
            const response = await fetch(changePassword, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    email: email,
                    password: passwordData.password
                }
            });

            if (response.ok) {
                return true;
            } else {
                showErrorMessage('Error setting password');
            }
        }
        catch (error) {
            console.log(error);
            showErrorMessage('Error setting password');
        }
    }

    const confirmUser = async () => {
        /* O PATH ESTÁ DESTA FORMA EM VEZ DE 'confirm-registration', PQ NO FRONTEND DAVA SEMPRE ERRO APESAR DE FUNCIONAR NO POSTMAN */

        const confirmUser = "http://localhost:8080/backend_proj5_war_exploded/rest/users/email/confirm";
            try {
                const response = await fetch(confirmUser, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                        email: email,
                    },
                    
                });
    
                if (response.ok) {
                    return true;
                } else {
                    const error = await response.text();
                    showErrorMessage("Error confirming user: " + error);
                    console.log("Error: " + error);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };
        


        return (
            <div className="centered-wrapper">
                <div id="set-passwordModal">
                    <h3>Please confirm your account</h3>
                    <div className="modalContent">
                        <form id="changePasswordForm">
                            <input type="password" id="profile_newPassword" name="password" placeholder="Password" value={passwordData.password} onChange={handlePasswordChange} required />
                            <input type="password" id="profile_confirmPassword" name="confirmPassword" placeholder="Confirm Password" value={passwordData.confirmPassword} onChange={handlePasswordChange} required />
                            <div className="modal-buttons">
                                <Button text="Cancel" onClick={handleCancelButton}/>
                                <Button type="submit" text="Save" onClick={handlePasswordSetAndConfirmAccount} />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
}