import { useState } from 'react';
import './RegisterContainer.css';
import { useNavigate } from 'react-router-dom';
import { showErrorMessage } from '../../functions/Messages/ErrorMessage';
import { RegisterUser } from '../../functions/Users/RegisterUser';
import { StatisticsStore } from '../../Stores/StatisticsStore';
import { useTranslation } from 'react-i18next';

function registerContainer() {

    const navigate = useNavigate();

    const { t } = useTranslation();

    const { sendMessage } = StatisticsStore((state) => ({ sendMessage: state.sendMessage }));

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
        event.preventDefault();

        let backToLoginLink = false;
        
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
            const registred = await RegisterUser(event, newUser);
            if (registred){
                sendMessage();
                backToLoginLink = true;
            }
        } catch (error) {
            console.error('Error:', error);
            showErrorMessage("Something went wrong. Please try again later.");
        }

        if (backToLoginLink) {
            navigate('/');
        }
        
    }


    return (
        <div className="container d-flex align-items-center vh-100">
            <div className="card mx-auto" style={{maxWidth: '500px'}}>
                <img id="logo-register" className="card-img-top mx-auto d-block" src="src\multimedia\logo-scrum-01.png" style={{maxWidth: '250px'}}/>
                <div className="card-body">
                    <form id="registrationForm">
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <input type="text" className="form-control" id="username-register" name="username" placeholder={t('username')} required onChange={handleInputChange}/>
                                <input type="password" className="form-control" id="password-register" name="password" placeholder={t('password')} required onChange={handleInputChange}/>
                                <input type="password" className="form-control" id="passwordConfirm-register" name="passwordConfirm" placeholder={t('confirmPassword')} required onChange={handleInputChange}/>
                                <input type="email" className="form-control" id="email-register" name="email" placeholder={t('email')} required onChange={handleInputChange}/>
                            </div>
                            <div className="col-md-6 mb-3">
                                <input type="text" className="form-control" id="firstName-register" name="firstName" placeholder={t('firstName')} required onChange={handleInputChange}/>
                                <input type="text" className="form-control" id="lastName-register" name="lastName" placeholder={t('lastName')} required onChange={handleInputChange}/>
                                <input type="text" className="form-control" id="phone-register" name="phone" placeholder={t('phone')} required onChange={handleInputChange}/>
                                <input type="url" className="form-control" id="photoURL-register" name="photoURL" placeholder={t('photoURL')} required onChange={handleInputChange}/>
                            </div>
                        </div>
                        <div className="d-flex justify-content-center mt-3">
                            <button type="submit" id="registerButton-register" className="btn btn-primary" onClick={handleRegisterSubmit}>{t('register')}</button>
                        </div>
                    </form>
                    <a id="backToLoginLink" className="d-block text-center mt-3" onClick={handleCancelClick}>{t('cancel')}</a>
                    <p id="warningMessage4" className="text-danger text-center mt-3"></p>
                </div>
            </div>
        </div>
    );
}

export default registerContainer;