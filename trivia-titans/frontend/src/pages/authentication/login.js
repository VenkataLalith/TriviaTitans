import React, { useState } from 'react';
import axios from 'axios';
import APIS from '../../apis.json';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { Google, Facebook, Home } from '@mui/icons-material';
import { LoginSocialGoogle, LoginSocialFacebook } from 'reactjs-social-login';
import './login.css';

function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const navigate = useNavigate();

	const onSubmit = (e) => {
		e.preventDefault();
		const logInData = {
			email,
			password,
		};

		const api = APIS['aws-lambda-api-authentication'] + '/login';

		axios
			.post(api, logInData)
			.then((response) => {
				if (response.message === 'Password not matched') {
					alert('ID and password not correct!!');
				}
				alert('ID and password verified!!');
				const accessToken =
					response.data.authenticationDetails.AuthenticationResult.AccessToken;
				window.localStorage.setItem('ACCESS_TOCKEN', accessToken);
				window.localStorage.setItem('LOGGED_IN_USER_USER_EMAIL', email);
				navigate('/afterlogin', { state: { email } });
			})
			.catch((err) => {
				alert(err.response.data.error.message);
			});
	};

	const navigateToHome = () => {
		navigate('/');
	};
	const navigateToForgotPass = () => {
		navigate('/forgot_pass');
	};
	const navigateToSignUp = () => {
		navigate('/signup');
	};
	const handleGoogleUserLogin = async (response) => {
		window.localStorage.setItem('LOGGED_IN_USER_USER_EMAIL', response?.email);
		window.localStorage.setItem('ACCESS_TOCKEN', response?.access_token);
		try {
			if (response?.email !== undefined) {
				navigate('/signupAfterGoogle', {
					state: {
						firstName: response?.given_name,
						lastName: response?.family_name,
						email: response?.email,
						pictureUrl: response?.picture,
					},
				});
				window.location.reload();
			}
		} catch (error) {
			alert('Google signup failed');
		}
	};

	const handleFacebookUserLogin = async (response) => {
		window.localStorage.setItem('LOGGED_IN_USER_USER_EMAIL', response?.email);
		window.localStorage.setItem('ACCESS_TOCKEN', response?.accessToken);
		try {
			if (response?.email !== undefined) {
				alert('Facebook Signup Success!!');
				navigate('/signupAfterGoogle', {
					state: {
						firstName: response?.first_name,
						lastName: response?.last_name,
						email: response?.email,
						// pictureUrl: response?.picture,
					},
				});
				window.location.reload();
			}
		} catch (error) {
			alert('Facebook signup failed');
		}
	};

	return (
		<div>
			<div className="login-form">
				<form onSubmit={onSubmit}>
					<h1 className="login-form-title">Login</h1>
					<label htmlFor="email">Email</label>
					<input
						value={email}
						type="email"
						required
						onChange={(e) => setEmail(e.target.value)}
					></input>
					<label htmlFor="password">Password</label>
					<input
						value={password}
						type="password"
						required
						onChange={(e) => setPassword(e.target.value)}
					></input>
					<button
						className="login-button"
						type="submit"
					>
						Login
					</button>
				</form>

				<div className="forgot-pass-and-signup-div">
					<a
						href="#"
						onClick={navigateToForgotPass}
						className="link-in-login"
					>
						Forgot Password
					</a>

					<a
						href="#"
						onClick={navigateToSignUp}
						className="link-in-login"
					>
						Sign Up
					</a>
				</div>

				<div className="center-buttons-login">
					<LoginSocialGoogle
						client_id={
							'598256017288-q7sv1chj2gtesctmvlv1k7k0vdv2pim0.apps.googleusercontent.com'
						}
						scope="openid profile email"
						discoveryDocs="claims_supported"
						access_type="offline"
						onResolve={({ provider, data }) => {
							handleGoogleUserLogin(data);
						}}
						onReject={(err) => {
							console.log(err);
						}}
					>
						<IconButton
							aria-label="Login with Google"
							style={{
								backgroundColor: '#fff',
								marginRight: '10px',
							}}
						>
							<Google
								fontSize="large"
								style={{ color: '#DB4437' }}
							/>
						</IconButton>
					</LoginSocialGoogle>

					<LoginSocialFacebook
						appId="188199594095341"
						onResolve={(response) => {
							console.log(response);
							handleFacebookUserLogin(response.data);
						}}
						onReject={(error) => {
							console.log(error);
						}}
					>
						<IconButton
							aria-label="Login with Facebook"
							style={{
								backgroundColor: '#fff',
								marginRight: '10px',
							}}
						>
							<Facebook
								fontSize="large"
								style={{ color: '#1877F2' }}
							/>
						</IconButton>
					</LoginSocialFacebook>

					<IconButton
						aria-label="Home"
						onClick={navigateToHome}
						style={{
							backgroundColor: '#fff',
						}}
					>
						<Home
							fontSize="large"
							style={{ color: '#333' }}
						/>
					</IconButton>
				</div>
			</div>
		</div>
	);
}

export default Login;
