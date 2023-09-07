// import React, { useState } from 'react';
// import './landingPage.css';
// import Path from '../../constants/path';
// import { Link } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
// import { LoginSocialGoogle, LoginSocialFacebook } from 'reactjs-social-login';
// import {
// 	GoogleLoginButton,
// 	FacebookLoginButton,
// } from 'react-social-login-buttons';

// function LandingPage() {
// 	const navigate = useNavigate();

// 	const handleGoogleUserLogin = async (response) => {
// 		window.localStorage.setItem('LOGGED_IN_USER_USER_EMAIL', response?.email);
// 		window.localStorage.setItem('ACCESS_TOCKEN', response?.access_token);
// 		try {
// 			if (response?.email !== undefined) {
// 				navigate('/signupAfterGoogle', {
// 					state: {
// 						firstName: response?.given_name,
// 						lastName: response?.family_name,
// 						email: response?.email,
// 						pictureUrl: response?.picture,
// 					},
// 				});
// 			}
// 		} catch (error) {
// 			alert('Google signup failed');
// 		}
// 	};

// 	const handleFacebookUserLogin = async (response) => {
// 		window.localStorage.setItem('LOGGED_IN_USER_USER_EMAIL', response?.email);
// 		window.localStorage.setItem('ACCESS_TOCKEN', response?.accessToken);
// 		try {
// 			if (response?.email !== undefined) {
// 				alert('Facebook Signup Success!!');
// 				navigate('/signupAfterGoogle', {
// 					state: {
// 						firstName: response?.first_name,
// 						lastName: response?.last_name,
// 						email: response?.email,
// 						// pictureUrl: response?.picture,
// 					},
// 				});
// 			}
// 		} catch (error) {
// 			alert('Facebook signup failed');
// 		}
// 	};

// 	return (
// 		<div>
// 			<div className="landing_page_title">Welcome to Trivia Titans</div>
// 			<div className="login_and_registration_btn">
// 				<div className="button_container">
// 					<Link
// 						to={Path.LOGIN}
// 						className="login_btn"
// 					>
// 						Login
// 					</Link>
// 					<Link
// 						to={Path.SIGNUP}
// 						className="login_btn"
// 					>
// 						SignUp
// 					</Link>
// 					<Link
// 						to={Path.FORGOTPASS}
// 						className="login_btn"
// 					>
// 						Forgot Password
// 					</Link>
// 					<LoginSocialGoogle
// 						client_id={
// 							'598256017288-q7sv1chj2gtesctmvlv1k7k0vdv2pim0.apps.googleusercontent.com'
// 						}
// 						scope="openid profile email"
// 						discoveryDocs="claims_supported"
// 						access_type="offline"
// 						onResolve={({ provider, data }) => {
// 							handleGoogleUserLogin(data);
// 						}}
// 						onReject={(err) => {
// 							console.log(err);
// 						}}
// 					>
// 						<GoogleLoginButton className="google_login_btn" />
// 					</LoginSocialGoogle>

// 					<LoginSocialFacebook
// 						appId="188199594095341"
// 						onResolve={(response) => {
// 							console.log(response);
// 							handleFacebookUserLogin(response.data);
// 						}}
// 						onReject={(error) => {
// 							console.log(error);
// 						}}
// 					>
// 						<FacebookLoginButton className="google_login_btn" />{' '}
// 					</LoginSocialFacebook>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

// export default LandingPage;

import React from 'react';
import './landingPage.css';
import Path from '../../constants/path';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { LoginSocialGoogle, LoginSocialFacebook } from 'reactjs-social-login';
import { Button, Container, Grid, Typography } from '@mui/material';
import { Facebook, Google } from '@mui/icons-material';
import {
	GoogleLoginButton,
	FacebookLoginButton,
} from 'react-social-login-buttons';

function LandingPage() {
	const navigate = useNavigate();

	return (
		<Container>
			<Grid
				container
				direction="column"
				alignItems="center"
				justifyContent="center"
				style={{ minHeight: '50vh' }}
			>
				<Grid item>
					<Typography
						variant="h1"
						className="landing_page_title"
						style={{
							color: '#007bff',
							marginBottom: '10rem',
							fontWeight: 'bold',
						}}
					>
						Welcome to Trivia Titans
					</Typography>
				</Grid>
				<Grid
					item
					container
					direction="column"
					alignItems="center"
					spacing={2}
				>
					<Grid item>
						<Button
							component={Link}
							to={Path.LOGIN}
							variant="contained"
							color="primary"
							className="login_btn"
							style={{ marginBottom: '0.5rem' }}
						>
							Login
						</Button>
					</Grid>
					<Grid item>
						<Button
							component={Link}
							to={Path.SIGNUP}
							variant="contained"
							color="primary"
							className="login_btn"
							style={{ marginBottom: '0.5rem' }}
						>
							SignUp
						</Button>
					</Grid>
				</Grid>
			</Grid>
		</Container>
	);
}

export default LandingPage;
