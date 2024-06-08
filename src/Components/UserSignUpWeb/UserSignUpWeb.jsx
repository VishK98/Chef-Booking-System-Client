import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import './UserSignUpWeb.css';
import Spinner from 'react-bootstrap/Spinner';
import logo from '../../../src/static/logo_no_background.svg';
import axios from 'axios';
import google from '../../assets/images/google_logo.png';
import apple from '../../assets/images/apple_logo.png';
const UserSignUpWeb = ({}) => {
  const [tryingToLogIn, setTryingToLogIn] = useState(false);
  const [isOTPsent, setIsOTPsent] = useState(false);
  const [otpInputFilled, setOtpInputFilled] = useState(false);
  const [otpSentText, setOtpSentText] = useState('');
  const [showLoader, setShowLoader] = useState(false);
  const [authenticationError, setAuthenticationError] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetOTPsent, setResetOTPsent] = useState(false);
  const [isPasswordTyped, setIsPasswordTyped] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    otp: '',
  });
  const location = useLocation();
  let { path } = location.state || {};
  const [errMessage, setErrMessage] = useState('');

  const navigate = useNavigate();

  const goToChefLogin = () => {
    navigate('/chef/profile');
  };

  const goToHomePage = () => {
    navigate('/');
  };

  const toggleFormMode = () => {
    navigate('/login');
    // setTryingToLogIn(!tryingToLogIn);
    // setFormData({
    //   name: '',
    //   email: '',
    //   password: '',
    //   otp: '',
    // });
    // setIsOTPsent(false);
    // setOtpSentText('');
    // setErrMessage('');
    // setResetOTPsent(false);
    // setShowLoader(false);
    // setForgotPassword(false);
    // setAuthenticationError(false);
    // if (tryingToLogIn) navigate('/signup');
    // else navigate('/login');
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[^\s]{8,}$/;
    return passwordRegex.test(password);
  };

  const validator = (password) => {
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
    // if(window.location.pathname == '/login')
    console.log('path', window.location.pathname);
    if (tryingToLogIn) {
      if (!forgotPassword) {
        try {
          let response = await axios.post(
            `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/users/login`,
            newFormData
          );
          if (response.status === 200 || response.status === 201) {
            const userName = response.data.userName;
            const authHeader = response.headers['authorization'];
            if (authHeader) {
              const token = authHeader.split(' ')[1];
              const expirationTime = new Date();
              expirationTime.setDate(expirationTime.getDate() + 15);

              localStorage.setItem('cowToken', token);

              localStorage.setItem('cowUserName', userName);

              setShowLoader(false);
              if (!path) path = '/';
              navigate(path);
            }
          }
        } catch (err) {
          setShowLoader(false);
          console.error(
            `Error ${tryingToLogIn ? 'logging in' : 'signing up'} user`,
            err.response.data.redirectRoute
          );
          const redirectRoute = err.response.data.redirectRoute;
          // console.log("! forgotPassword ", redirectRoute);
          if (redirectRoute === '/api/users/resetpassword') {
            setAuthenticationError(true);
            setErrMessage('Email or Password incorrect');
          } else if (redirectRoute === '/api/users/login') {
            setTryingToLogIn(true);
            setErrMessage('Account already exists! Please log in.');
          } else if (redirectRoute === '/api/users/signup') {
            setTryingToLogIn(false);
            setErrMessage('User not found. Please sign up.');
          }
        }
      } else {
        if (!resetOTPsent) {
          try {
            let response = await axios.post(
              `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/users/resetpassword`,
              newFormData
            );
            if (response.status === 200 || response.status === 201) {
              setResetOTPsent(true);
              setShowLoader(false);
              setOtpSentText('OTP sent successfully');
            }
          } catch (err) {
            setShowLoader(false);
            console.error(
              `Error ${tryingToLogIn ? 'logging in' : 'signing up'} user`,
              err.response.data.redirectRoute
            );
            const redirectRoute = err.response.data.redirectRoute;
            if (redirectRoute === '/api/users/resetpassword') {
              setAuthenticationError(true);
              setErrMessage('Email or Password incorrect!');
            } else if (redirectRoute === '/api/users/login') {
              setTryingToLogIn(true);
              setErrMessage('Account already exists! Please log in.');
            } else if (redirectRoute === '/api/users/signup') {
              setTryingToLogIn(false);
              setErrMessage('User not found. Please sign up.');
            }
          }
        } else {
          try {
            let response = await axios.post(
              `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/users/resetuser`,
              newFormData
            );
            if (response.status === 200 || response.status === 201) {
              const userName = response.data.userName;
              const authHeader = response.headers['authorization'];
              if (authHeader) {
                const token = authHeader.split(' ')[1];
                const expirationTime = new Date();
                expirationTime.setDate(expirationTime.getDate() + 15);

                localStorage.setItem('cowToken', token);
                localStorage.setItem('cowUserName', userName);
                setShowLoader(false);
                setResetOTPsent(false);
                setAuthenticationError(false);
              }
              setShowLoader(false);
            }
          } catch (err) {
            setShowLoader(false);
            console.error(
              `Error ${tryingToLogIn ? 'logging in' : 'signing up'} user`,
              err.response.data.redirectRoute
            );
            const redirectRoute = err.response.data.redirectRoute;
            if (redirectRoute === '/api/users/resetpassword') {
              setAuthenticationError(true);
              setErrMessage(err.response.data.message);
            } else if (redirectRoute === '/api/users/login') {
              setTryingToLogIn(true);
              setErrMessage(err.response.data.message);
            } else if (redirectRoute === '/api/users/signup') {
              setTryingToLogIn(false);
              setErrMessage('User not found. Please sign up.');
            }
          }
        }
      }
    } else {
      if (isOTPsent) {
      } else {
        // if (!validatePassword(FormData.password)) return;
        try {
          let response = await axios.post(
            `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/users/signup`,
            newFormData
          );
          if (response.status === 200 || response.status === 201) {
            setIsOTPsent(true);
            setOtpSentText('OTP sent successfully');
            setErrMessage('');
            setShowLoader(false);
          }
        } catch (error) {
          setShowLoader(false);
          console.error(
            `Error ${tryingToLogIn ? 'logging in' : 'signing up'} user.`,
            error
          );
          const redirectRoute = error.response.data.redirectRoute;
          if (redirectRoute === '/api/users/login') {
            setTryingToLogIn(true);
            setErrMessage('Account already exists! Please log in.');
          } else if (redirectRoute === '/api/users/signup') {
            setTryingToLogIn(false);
            setErrMessage('User not found. Please sign up.');
          }
        }
      }
    }
  };

  const handleVerification = async (e) => {
    setShowLoader(true);
    const newFormData = {
      ...formData,
      email: formData.email.toLowerCase(),
    };
    try {
      let verificationResponse = await axios.post(
        `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/users/verify`,
        newFormData
      );
      if (
        verificationResponse.status === 200 ||
        verificationResponse.status === 201
      ) {
        const userName = verificationResponse.data.userName;
        const authHeader = verificationResponse.headers['authorization'];
        if (authHeader) {
          const token = authHeader.split(' ')[1];
          const expirationTime = new Date();
          expirationTime.setDate(expirationTime.getDate() + 15);
          localStorage.setItem('cowToken', token);
          localStorage.setItem('cowUserName', userName);
          setIsOTPsent(false);
        } else {
          setShowLoader(false);
          console.error('Authorization header not found in response');
        }
      } else {
        console.log(verificationResponse.data);
      }
    } catch (err) {
      setShowLoader(false);
      console.error(
        `Error ${tryingToLogIn ? 'logging in' : 'signing up'} user:`,
        err
      );
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
            onClick={() => window.location.reload()}
          />
          <h5
            className='App-name-text-login'
            onClick={() => window.location.reload()}
          >
            Chef on Wheelz
          </h5>
        </div>
        <div className='image-text-container'>
          <h2 className='welcome-text-user'>Find Your Private Chef Today</h2>
          <p className='hello-text-user'>
            Indulge in personalised dining at home with our Private Chefs.
            Explore a variety of cuisines effortlessly with just a few clicks.
          </p>
        </div>
      </div>
      <div className='user-login-form-container onboarding-form-div'>
        <h3 className='login-signup-heading'>Sign Up</h3>
        <p onClick={toggleFormMode} className='user-form-text'>
          <>
            <span className='original-text'>Already have an account?</span>
            <span className='teal-text'> Sign in</span>
          </>
        </p>
        <p className='authentication-error-message'>{errMessage}</p>
        <Form onSubmit={handleSubmit} className='onboarding-form'>
          {!tryingToLogIn && !forgotPassword && (
            <Form.Group controlId='name'>
              <div className='form-text-label-group'>
                <Form.Label>Full name</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Adam Smith'
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  readOnly={isOTPsent}
                  required
                />
              </div>
            </Form.Group>
          )}

          <Form.Group controlId='email'>
            <div className='form-text-label-group mt-3 mb-3'>
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
                readOnly={isOTPsent || resetOTPsent}
                required
              />
            </div>
          </Form.Group>

          {(!forgotPassword || resetOTPsent) && (
            <>
              {/* Password input */}
              <Form.Group controlId='password'>
                <div className='form-text-label-group'>
                  <Form.Label>
                    {resetOTPsent ? 'New Password' : 'Password'}
                  </Form.Label>
                  <Form.Control
                    type={isPasswordVisible ? 'text' : 'password'}
                    placeholder={
                      resetOTPsent ? 'Enter New Password' : 'Enter Password'
                    }
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        password: e.target.value,
                      });
                      setIsPasswordTyped(true);
                      if (!tryingToLogIn) validator(e.target.value);
                    }}
                    readOnly={isOTPsent}
                    required
                  />
                  <i
                    id='see'
                    onClick={togglePasswordVisibility}
                    className={`far ${
                      isPasswordVisible ? 'fa-eye-slash' : 'fa-eye'
                    }`}
                  ></i>
                </div>
              </Form.Group>

              {/* show validation checks only while signing up */}
              {!tryingToLogIn && (
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
            </>
          )}
          <div className='submit-button'>
            {!isOTPsent && !resetOTPsent && (
              <button
                className='btn login-submit-button mt-3'
                type='submit'
                disabled={
                  !tryingToLogIn && !validatePassword(formData.password)
                }
              >
                {!showLoader ? (
                  'Sign Up'
                ) : (
                  <Spinner animation='border' size='sm' />
                )}
              </button>
            )}
            {(isOTPsent || resetOTPsent) && (
              <button type='submit' disabled={!otpInputFilled}>
                {!showLoader ? (
                  'Verify OTP'
                ) : (
                  <Spinner animation='border' size='sm' />
                )}
              </button>
            )}
          </div>
        </Form>
        {tryingToLogIn && (
          <div className='or-container'>
            <span></span>
            <p className='or'>or</p>
            <span></span>
          </div>
        )}
        {/* <button className='btn google-logo-button'>
          <img className='apple-google-logo' src={google} />
          Sign Up with Google
        </button>
        <button className='btn apple-logo-button'>
          <img className='apple-google-logo' src={apple} />
          Sign Up with Apple
        </button> */}
        {tryingToLogIn && (
          <button className='login-as-a-chef' onClick={goToChefLogin}>
            {'Log in as a chef'}
          </button>
        )}
      </div>
    </div>
  );
};

export default UserSignUpWeb;
