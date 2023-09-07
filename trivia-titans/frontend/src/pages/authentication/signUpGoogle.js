import React, { useState, useEffect } from 'react';
import APIS from '../../apis.json';
import axios from 'axios';
import API from '../../interceptors/interceptors';
import { useNavigate, useLocation } from 'react-router-dom';
import './signupGoogle.css';

function SignUpGoogle() {
	const navigate = useNavigate();
	const { state } = useLocation();
	const { firstName, lastName, email, pictureUrl } = state;

	// const email = window.localStorage.getItem('google_login_user_email');
	// const [age, setAge] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [passwordError, setPasswordError] = useState('');

	// const handlePasswordChange = (e) => {
	// 	setPassword(e.target.value);
	// };

	// const handleConfirmPasswordChange = (e) => {
	// 	setConfirmPassword(e.target.value);
	// };

	// const handleConfirmPasswordBlur = () => {
	// 	if (password !== confirmPassword) {
	// 		setPasswordError('Passwords do not match');
	// 	} else {
	// 		setPasswordError('');
	// 	}
	// };

	const handleSubmit = async (e) => {
		// e.preventDefault();

		// const userId = email;

		// if (password !== confirmPassword) {
		// 	setPasswordError('Passwords do not match');
		// } else {
		// if (!email || !password) {
		// 	// Display an error message
		// 	alert('Please fill in all fields');
		// }
		// else {
		const signUpData = {
			email,
		};

		const profileDetails = {
			firstName,
			lastName,
			email,
			// age,
		};

		const gameHistory = {
			totalGamePlayed: '0',
			win: '0',
			loss: '0',
			pointsEarned: '0',
		};

		const userData = {
			userId: email,
			profileDetails,
			gameHistory,
		};

		const api =
			APIS['aws-lambda-api-authentication'] + '/verifyUserWithoutCode';
		const apiStoreUser = APIS['cloud-finction-store-user-url'] + '/store_users';

		API.post(api, signUpData)
			.then((response) => {
				console.log(response);
				if (response.message) {
					// Handle the success response
					alert(
						'Account Verified and User created with selected google account!!'
					);
					navigate('/profile', { state: { email } });
				}
			})
			.catch((error) => {
				navigate('/profile', { state: { email } });
			});

		API.post(apiStoreUser, userData)
			.then((response) => {
				if (response.status === 200) {
					console.log('User stored in database');
				} else {
					console.log('Error storing user in database');
				}
			})
			.catch((error) => {
				console.log(error);
			});

		const apiNewGameSubscription =
			APIS['aws-sns-topic-new-game-subscription-url'];
		const apiGameInviteSubscription =
			APIS['aws-sns-topic-game-invite-subscription-url'];

		axios
			.post(apiNewGameSubscription, { email })
			.then((response) => {
				if (response) {
					console.log(response);
				} else {
					console.log('Error sending notificatiion');
				}
			})
			.catch((error) => {
				console.log(error);
			});

		axios
			.post(apiGameInviteSubscription, { email })
			.then((response) => {
				if (response) {
					console.log(response);
				} else {
					console.log('Error sending notificatiion');
				}
			})
			.catch((error) => {
				console.log(error);
			});

		// }
		// }
	};

	useEffect(() => {
		handleSubmit();
	}, []);

	return (
		<></>
		// <div className="signup-form-google">
		// 	<h1 className="signup-form-google-title">Signup with Trivia Titans</h1>
		// 	<form onSubmit={handleSubmit}>
		// 		{/* <label htmlFor="password">Password</label>
		// 		<input
		// 			value={password}
		// 			type="password"
		// 			// required
		// 			onChange={handlePasswordChange}
		// 		></input>

		// 		<label htmlFor="password">Confirm Password</label>
		// 		<input
		// 			value={confirmPassword}
		// 			type="password"
		// 			// required
		// 			onChange={handleConfirmPasswordChange}
		// 			onBlur={handleConfirmPasswordBlur}
		// 		></input>
		// 		{passwordError && <p>{passwordError}</p>}

		// 		<label htmlFor="first name">First name:</label>
		// 		<input
		// 			value={firstName}
		// 			required
		// 			onChange={(e) => serFirstName(e.target.value)}
		// 		></input>

		// 		<label htmlFor="last name">Last name:</label>
		// 		<input
		// 			value={lastName}
		// 			required
		// 			onChange={(e) => setLastName(e.target.value)}
		// 		></input> */}

		// 		{/* <label htmlFor="age">Age:</label>
		// 		<input
		// 			value={age}
		// 			required
		// 			onChange={(e) => setAge(e.target.value)}
		// 		></input> */}

		// 		<button type="submit">SignUp</button>
		// 	</form>
		// </div>
	);
}

export default SignUpGoogle;
