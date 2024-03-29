import React, { useState } from 'react';
import './RegisterContainer.css';
import { useNavigate } from 'react-router-dom';
import { showErrorMessage } from '../../functions/Messages/ErrorMessage';
import { RegisterUser } from '../../functions/Users/RegisterUser';

function registerContainer() {

    const navigate = useNavigate();

    const handleCancelClick = () => {
        navigate('/');
    };

    const [input, setInput] = useState({
        username: '',
        password: '',
        passwordConfirm: '',
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        photoURL: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInput(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleRegisterSubmit = async (event) => {
        
        let backToLoginLink = false;
            event.preventDefault();
            const newUser = {
                username: input.username,
                password: input.password,
                email: input.email,
                firstName: input.firstName,
                lastName: input.lastName,
                phone: input.phone,
                photoURL: input.photoURL
            };

        try {
            await RegisterUser(event, newUser);
            backToLoginLink = true;
        } catch (error) {
            console.error('Error:', error);
            showErrorMessage("Something went wrong. Please try again later.");
        }
        if (backToLoginLink) {
            navigate('/');
        }
        
    }


  return (
    <div className="center-container-login">
        <div className="registerPanel">
            <img id="logo-register" src="src\multimedia\logo-scrum-01.png" width="250"/>
            <form id="registrationForm" className="inputs-register">
                <div className="right-inputs">
                    <input type="text" className="inputRegister-fields" id="username-register" name="username" placeholder="Username" required onChange={handleInputChange}/>
                    <input type="password" className="inputRegister-fields" id="password-register" name="password" placeholder="Password" required onChange={handleInputChange}/>
                    <input type="password" className="inputRegister-fields" id="passwordConfirm-register" name="passwordConfirm" placeholder="Confirm Password" required onChange={handleInputChange}/>
                    <input type="email" className="inputRegister-fields" id="email-register" name="email" placeholder="Email" required onChange={handleInputChange}/>
                </div>
                <div className="left-inputs">
                    <input type="text" className="inputRegister-fields" id="firstName-register" name="firstName" placeholder="First Name" required onChange={handleInputChange}/>
                    <input type="text" className="inputRegister-fields" id="lastName-register" name="lastName" placeholder="Last Name" required onChange={handleInputChange}/>
                    <input type="text" className="inputRegister-fields" id="phone-register" name="phone" placeholder="Phone" required onChange={handleInputChange}/>
                    <input type="url" className="inputRegister-fields" id="photoURL-register" name="photoURL" placeholder="Photo URL" required onChange={handleInputChange}/>
                </div>
                <div className="submitButton">
                    <button type="submit" id="registerButton-register" onClick={handleRegisterSubmit}>Register</button>
                </div>
            </form>
            <a id="backToLoginLink" onClick={handleCancelClick}>Cancel</a>
            <p id="warningMessage4"></p>
        </div>
    </div>
    );
}

export default registerContainer;