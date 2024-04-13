import './ConfirmAccount.css';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { showErrorMessage } from "../../functions/Messages/ErrorMessage";
import { useNavigate } from "react-router-dom";
import { showSuccessMessage } from "../../functions/Messages/SuccessMessage";
import { showInfoMessage } from "../../functions/Messages/InfoMessage";
import Button from '../General/Button';
import { SetPassword } from '../../functions/Users/SetPassword';

export function ConfirmAccount() {

    const navigate = useNavigate();

    const {validationToken} = useParams();

    const [passwordDefined, setPasswordDefined] = useState(false);

    useEffect(() => {
        const checkPasswordDefined = async () => {
            const defined = await isPasswordDefined();
            if (defined) {
                handleConfirmAccount();
            } 
        };
        checkPasswordDefined();
    }, []);

    const isPasswordDefined = async () => {

        const isPasswordDefined = "http://localhost:8080/backend_proj5_war_exploded/rest/users/defined-password";

        try {
            const response = await fetch(isPasswordDefined, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    validationToken: validationToken
                }
            });
            if (response.ok) {
                const data = await response.json();
                setPasswordDefined(data);
                return data;
            } else {
                console.log(response);
                setPasswordDefined(false);
                return false;
            }
        } catch (error) {
            console.log(error);
            setPasswordDefined(false);
            return false;
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
        if (await SetPassword(e, validationToken, passwordData.password, passwordData.confirmPassword)) {
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
        }
    };

    const handleCancelButton = () => {
        navigate('/');
    };

    
    const confirmUser = async () => {
        /* O PATH ESTÁ DESTA FORMA EM VEZ DE 'confirm-registration', PQ NO FRONTEND DAVA SEMPRE ERRO APESAR DE FUNCIONAR NO POSTMAN */

        const confirmUser = "http://localhost:8080/backend_proj5_war_exploded/rest/users/email/confirm";
            try {
                const response = await fetch(confirmUser, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                        validationToken: validationToken,
                    },
                    
                });
    
                if (response.ok) {
                    return true;
                } else if (response.status === 400) {
                    showInfoMessage("Account already confirmed");
                    return false
                } else {
                    showErrorMessage("Error confirming account");
                    return false;
                }
            } catch (error) {
                console.error("Error:", error);
                return false;
            }
        };
        


        return (
            <div className="centered-wrapper">
                {!passwordDefined ?
                    <div id="set-password">
                        <h3>Please confirm your account</h3>
                        <form id="setPasswordForm">
                            <input type="password" id="newPassword" name="password" placeholder="Password" value={passwordData.password} onChange={handlePasswordChange} required />
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