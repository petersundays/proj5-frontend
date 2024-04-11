import './ConfirmAccount.css';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { showErrorMessage } from "../../functions/Messages/ErrorMessage";
import { useNavigate } from "react-router-dom";
import { showSuccessMessage } from "../../functions/Messages/SuccessMessage";
import Button from '../General/Button';

export function ConfirmAccount() {

    const navigate = useNavigate();

    const {email} = useParams();

    const [passwordDefined, setPasswordDefined] = useState(false);

    useEffect(() => {
        const checkPasswordDefined = async () => {
            await isPasswordDefined();
            if (passwordDefined) {
                console.log('############******* Password defined', passwordDefined);
/*                 handleConfirmAccount();
 */            }
        };
        checkPasswordDefined();
    }, [passwordDefined]);

    const isPasswordDefined = async () => {

        const isPasswordDefined = "http://localhost:8080/backend_proj5_war_exploded/rest/users/defined-password";

        try {
            const response = await fetch(isPasswordDefined, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    email: email
                }
            });

            if (response.ok) {
                const defined = await response.json();
                console.log('Password Boolean:', defined);
                setPasswordDefined(defined);
            } else {
                console.log('Error checking if password is defined');
                setPasswordDefined(false);
            }
        } catch (error) {
            console.log(error);
            setPasswordDefined(false);
        }
    };

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

    const handleConfirmAccount = async () => {
        if (await confirmUser()) {
            showSuccessMessage('Account confirmed');
            navigate('/');
        } else {
            showErrorMessage('Error confirming account, please contact support');
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
                {!passwordDefined ?
                    <div id="set-password">
                        <h3>Please confirm your account</h3>
                        <form id="setPasswordForm">
                            <input type="password" id="password" name="password" placeholder="Password" value={passwordData.password} onChange={handlePasswordChange} required />
                            <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" value={passwordData.confirmPassword} onChange={handlePasswordChange} required />
                            <div className="password-buttons">
                                <Button text="Cancel" onClick={handleCancelButton}/>
                                <Button type="submit" text="Save" onClick={handlePasswordSetAndConfirmAccount} />
                            </div>
                        </form>
                    </div>
                :
                    <div>
                        <Button text="Go to login" onClick={() => navigate('/')} />
                    </div>
                }
            </div>
        );
}