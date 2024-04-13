import { useState } from "react";
import Button from "../General/Button";
import { showSuccessMessage } from "../../functions/Messages/SuccessMessage";
import { showErrorMessage } from "../../functions/Messages/ErrorMessage";
import { useNavigate } from "react-router-dom";

function RecoverPassword() {

    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleEmailInput = (e) => {
        setEmail(e.target.value);
    };

    const handleCancelButton = () => {
        navigate('/');
    };
        

    const handleRecoverPassword = async () => {
        const recoverPasswordRequest = "http://localhost:8080/backend_proj5_war_exploded/rest/users/recover-password";

        try {
            const response = await fetch(recoverPasswordRequest, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    email: email
                },
                
            });

            if (response.ok) {
                showSuccessMessage('Password recovery email sent, please check your email.');
                navigate('/');
            } else {
                const message = await response.text();
                showErrorMessage(message);
            }
        } catch (error) {
            showErrorMessage('An error occurred. Please try again later.');
        }
    }



  return (
    <div>
      <h1>Recover Password</h1>
      <input className="email-to-recover" type="text" placeholder="email" onChange={handleEmailInput} required />
      <Button text="Cancel" onClick={handleCancelButton} />
      <Button text="Send" onClick={ handleRecoverPassword}/>
    </div>
  );
}
export default RecoverPassword;