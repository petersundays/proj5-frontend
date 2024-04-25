import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { UserStore } from '../../Stores/UserStore';
import Button from '../General/Button';
import { showSuccessMessage } from '../../functions/Messages/SuccessMessage';
import { showErrorMessage } from '../../functions/Messages/ErrorMessage';
import { TranslationStore } from '../../Stores/TranslationStore';
import languages from '../../translations';
import { IntlProvider, FormattedMessage } from 'react-intl';

function LoginContainer() {
    
    const navigate = useNavigate();

    const locale = TranslationStore((state) => state.language);
    const updateLocale = TranslationStore((state) => state.changeLanguage);

    const handleSelect = (event) => {
        console.log(event.target.value);
        updateLocale(event.target.value);
    };

    const handleRegisterClick = () => {
        navigate('/register');
    };

    const [input, setInput] = useState({
        username: '',
        password: ''
    });


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInput(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
      
    const handleLoginSubmit = async (event) => {
        event.preventDefault();

        const loginRequest = "http://localhost:8080/backend_proj5_war_exploded/rest/users/login";

        try {
            const response = await fetch(loginRequest, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*'
                },
                body: JSON.stringify(input)
            });

            if (response.ok) {
                const user = await response.json();
                UserStore.setState({ user: user });
                if (user.confirmed === false) {
                    navigate('/account-not-confirmed');
                    return;
                } else {
                    showSuccessMessage('Welcome to Agile Scrum!');
                    navigate('/my-scrum');
                }
            } else if (response.status === 401) {
                showErrorMessage("Invalid credentials, please try again.");
            } else {
                showErrorMessage("Something went wrong. Please try again later.");
            }
        } catch (error) {
            console.error('Error:', error);
            showErrorMessage("Something went wrong. Please try again later.");
        }
    };


    return (
        <div className='landingPage-container'>
            <div className='landingPage-image-container'>
                <img src="src\multimedia\logo-scrum-05.png" id="landingPage-image" />
            </div>
            <div className="loginpanel">
            <select onChange={handleSelect} defaultValue={locale}>
                {["en", "pt", "fr"].map(language => (<option
                key={language}>{language}</option>))}
            </select>
            <IntlProvider locale={locale} messages={languages[locale]}>
                <p>
                <br/>
                <FormattedMessage id="time" values={{t: Date.now()}} />
                <br/>
                <FormattedMessage id="date" values={{d: Date.now()}} />
                <br/>
                </p>
            </IntlProvider>
                <h1 id="landingPage-welcome" width="250">WELCOME!</h1>
                <div className='landingPage-spaceBetween'></div>
                <h2 id="loginText">Sign In</h2>
                <form id="login-form" className="input-login">
                    <input type="text" id="username" name="username" placeholder="username" value={input.username} onChange={handleInputChange} required />
                    <input type="password" id="password" name="password" placeholder="password" value={input.password} onChange={handleInputChange} required />
                    <div className="forgot-password">
                        <Link to="/recover-password" className='recover-password'>Forgot your password?</Link>
                    </div>
                    <Button onClick={handleLoginSubmit} width="150px" text="Confirm"></Button>
                    <Button id="registerButton" onClick={handleRegisterClick} width="150px" text="Register"></Button>
                </form>
                <p id="warningMessage"></p>
            </div>
        </div>
    );
}

export default LoginContainer;
