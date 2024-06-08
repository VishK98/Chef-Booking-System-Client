import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import axios from 'axios';
import './ChefLoginForm.css';
import logo from '../../../src/static/logo_no_background.svg';

const ChefLoginForm = ({
  isChefLoggedIn,
  setIsChefLoggedIn,
  loggedInChefName,
  setLoggedInChefName,
  onSuccessLogin,
  onSuccessRoute,
}) => {
  const [tryingToLogIn, setTryingToLogIn] = useState(true);
  const [isOTPsent, setIsOTPsent] = useState(false);
  const [otpInputFilled, setOtpInputFilled] = useState(false);
  const [otpSentText, setOtpSentText] = useState('');
  const [showLoader, setShowLoader] = useState(false);
  const [authenticationError, setAuthenticationError] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [showResetPasswordForms, setShowResetPasswordForms] = useState(false);
  const [isPasswordTyped, setIsPasswordTyped] = useState(false);
  const [isNewPasswordTyped, setIsNewPasswordTyped] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmedPasswordVisible, setIsConfirmedPasswordVisible] =
    useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    otp: '',
    newPassword: '',
    confirmedPassword: '',
  });
  const [errMessage, setErrMessage] = useState('');

  const navigate = useNavigate();

  const toggleFormMode = () => {
    setTryingToLogIn(!tryingToLogIn);
    setErrMessage('');
  };

  const arePasswordsMatching = (password1, password2) => {
    // console.log(password1 + " - " + password2);
    return password1 === password2;
  };

  const togglePasswordVisibility = (value) => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[^\s]{8,}$/;
    return passwordRegex.test(password);
  };

  const validator = (password) => {
    // console.log("New Password:", password);
    document.getElementById('check0').style.color =
      password.length >= 8 ? 'green' : 'red';
    document.getElementById('check1').style.color = password.includes(' ')
      ? 'red'
      : 'green';
    document.getElementById('check2').style.color = /\d/.test(password)
      ? 'green'
      : 'red';
    document.getElementById('check3').style.color = /[a-z]/.test(password)
      ? 'green'
      : 'red';
    document.getElementById('check4').style.color = /[A-Z]/.test(password)
      ? 'green'
      : 'red';
    document.getElementById('check5').style.color = /[&$#@*]/.test(password)
      ? 'green'
      : 'red';

    const checkIcons = document.querySelectorAll('.password-validator-div i');
    checkIcons.forEach((icon, index) => {
      if (icon.parentNode.id === `check${index}`) {
        icon.className = 'far fa-check-circle';
        icon.style.color =
          document.getElementById(`check${index}`).style.color === 'red'
            ? 'red'
            : 'green';
        if (icon.style.color === 'red') {
          icon.className = 'far fa-circle-xmark';
        }
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setShowLoader(true);

    const newFormData = {
      ...formData,
      email: formData.email.toLowerCase(),
    };

    if (tryingToLogIn) {
      try {
        const endPoint = showResetPasswordForms
          ? '/api/chefs/resetpassword'
          : '/api/chefs/login';
        let response = await axios.post(
          `${process.env.REACT_APP_BACKEND_ENDPOINT}${endPoint}`,
          newFormData
        );
        if (response.status === 200) {
          const chefName = response.data.chefName;
          const authHeader = response.headers['authorization'];
          if (authHeader) {
            const token = authHeader.split(' ')[1];
            const expirationTime = new Date();
            expirationTime.setDate(expirationTime.getDate() + 15);

            localStorage.setItem('cowChefToken', token);
            localStorage.setItem('cowChefTokenExpiration', expirationTime);
            localStorage.setItem('cowChefName', chefName);
            setIsChefLoggedIn(true);
            navigate('/chef/profile');
            setLoggedInChefName(chefName);
            setShowLoader(false);
          }
        } else if (response.status === 201) {
          setShowLoader(false);
          setShowResetPasswordForms(true);
        }
      } catch (err) {
        setShowLoader(false);
        setShowResetPasswordForms(false);
        setErrMessage(err.response.data.message);
        console.error(
          `Error ${tryingToLogIn ? 'logging in' : 'signing up'} user`,
          err
        );
      }
    } else {
      // do nothing
    }
  };

  return (
    <div className='popup onboarding-container'>
      <div className='onboarding-image-carousel'>
        <div className='logo-container'>
          <img
            className='logouserlogin'
            src={logo}
            alt='Logo'
            onClick={() => navigate('/')}
          />
          <h5 className='App-name-text-login'>Chef on Wheelz</h5>
        </div>
        <div className='image-text-container'>
          <h2 className='welcome-text'>
            Join our chef team and share your culinary magic with people
            everywhere!
          </h2>
          <h4 className='hello-text'>
            Set your own schedule and work on your own terms
          </h4>
        </div>
      </div>
      <div className='user-login-form-container onboarding-form-div'>
        <h2 style={{ marginTop: '10px' }}>
          {tryingToLogIn ? 'Log In' : 'Reset Password'}
        </h2>

        {authenticationError && (
          <>
            <br />
            <span className='teal-text' onClick={() => setForgotPassword(true)}>
              Forgot password?
            </span>
          </>
        )}

        <p className='authentication-error-message'>{errMessage}</p>
        <Form onSubmit={handleSubmit} className='onboarding-form'>
          {!showResetPasswordForms && (
            <Form.Group controlId='email'>
              <div className='form-text-label-group'>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type='email'
                  placeholder='adam@gmail.com'
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  // readOnly
                  required
                />
              </div>
            </Form.Group>
          )}

          {!showResetPasswordForms && (
            <Form.Group controlId='password'>
              <div className='form-text-label-group'>
                <Form.Label>{'Password'}</Form.Label>
                <Form.Control
                  type={isPasswordVisible ? 'text' : 'password'}
                  placeholder={'Enter Password'}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      password: e.target.value,
                    });
                    setIsPasswordTyped(true);
                    if (!tryingToLogIn) validator(e.target.value);
                  }}
                  // readOnly={isOTPsent}
                  required
                />
                <i
                  id='see'
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className={`far ${
                    isPasswordVisible ? 'fa-eye-slash' : 'fa-eye'
                  }`}
                ></i>
              </div>
            </Form.Group>
          )}

          {showResetPasswordForms && (
            <Form.Group controlId='newPassword'>
              <div className='form-text-label-group'>
                <Form.Label>{'Enter new password'}</Form.Label>
                <Form.Control
                  type={isNewPasswordVisible ? 'text' : 'password'}
                  placeholder={'Enter New Password'}
                  value={formData.newPassword}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      newPassword: e.target.value,
                    });
                    setIsNewPasswordTyped(true);
                    if (tryingToLogIn && showResetPasswordForms)
                      validator(e.target.value);
                  }}
                  required
                />
                <i
                  id='see'
                  onClick={() => setIsNewPasswordVisible(!isNewPasswordVisible)}
                  className={`far ${
                    isNewPasswordVisible ? 'fa-eye-slash' : 'fa-eye'
                  }`}
                ></i>
              </div>
            </Form.Group>
          )}

          {showResetPasswordForms && (
            <Form.Group controlId='confirmedPassword'>
              <div className='form-text-label-group'>
                <Form.Label>{'Confirm your password'}</Form.Label>
                <Form.Control
                  type={isConfirmedPasswordVisible ? 'text' : 'password'}
                  placeholder={'Re-enter Password'}
                  value={formData.confirmedPassword}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      confirmedPassword: e.target.value,
                    });
                  }}
                  required
                />
                <i
                  id='see'
                  onClick={() =>
                    setIsConfirmedPasswordVisible(!isConfirmedPasswordVisible)
                  }
                  className={`far ${
                    isConfirmedPasswordVisible ? 'fa-eye-slash' : 'fa-eye'
                  }`}
                ></i>
              </div>
            </Form.Group>
          )}

          {tryingToLogIn && showResetPasswordForms && (
            <div className='password-validator-div'>
              <div id='check0'>
                <i className='far fa-check-circle'></i>{' '}
                <span className='password-validator-text'>
                  Length should be atleast 8
                </span>
              </div>
              <div id='check1'>
                <i className='far fa-check-circle'></i>{' '}
                <span className='password-validator-text'>
                  Shouldn't contain empty space
                </span>
              </div>
              <div id='check2'>
                <i className='far fa-check-circle'></i>{' '}
                <span className='password-validator-text'>
                  Contains atleast one numeric digit [0-9]
                </span>
              </div>
              <div id='check3'>
                <i className='far fa-check-circle'></i>{' '}
                <span className='password-validator-text'>
                  {' '}
                  Contains atleast one lowercase character [a - z]
                </span>
              </div>
              <div id='check4'>
                <i className='far fa-check-circle'></i>{' '}
                <span className='password-validator-text'>
                  Contains atleast one uppercase character[A - Z]
                </span>
              </div>
              <div id='check5'>
                <i className='far fa-check-circle'></i>{' '}
                <span className='password-validator-text'>
                  Contains atleast one special character [&, $, #, @, *]
                </span>
              </div>
            </div>
          )}

          <div className='submit-button'>
            {
              <button
                type='submit'
                className='password-reset-button btn login-submit-button mt-3'
                disabled={
                  (!tryingToLogIn && !validatePassword(formData.password)) ||
                  (tryingToLogIn &&
                    showResetPasswordForms &&
                    (!validatePassword(formData.newPassword) ||
                      !arePasswordsMatching(
                        formData.newPassword,
                        formData.confirmedPassword
                      )))
                }
              >
                {!showLoader ? (
                  tryingToLogIn ? (
                    showResetPasswordForms ? (
                      'Reset'
                    ) : (
                      'Log in'
                    )
                  ) : (
                    'Sign up'
                  )
                ) : (
                  <Spinner animation='border' size='sm' />
                )}
              </button>
            }
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ChefLoginForm;
