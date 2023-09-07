import axios from 'axios';
import React, { useState } from 'react';
import APIS from '../../apis.json';
import { useNavigate } from 'react-router-dom';
import './signup.css';

function SignUp() {
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [firstName, serFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [age, setAge] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [passwordError, setPasswordError] = useState('');

	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
	};

	const handleConfirmPasswordChange = (e) => {
		setConfirmPassword(e.target.value);
	};

	const handleConfirmPasswordBlur = () => {
		if (password !== confirmPassword) {
			setPasswordError('Passwords do not match');
		} else {
			setPasswordError('');
		}
	};

	const onSubmit = (e) => {
		e.preventDefault();
		const userId = email;

		if (password !== confirmPassword) {
			setPasswordError('Passwords do not match');
		} else {
			if (!email || !password) {
				// Display an error message
				alert('Please fill in all fields');
			} else {
				const emailOfIUser = { email };
				const signUpData = {
					email,
					password,
				};

				const profileDetails = {
					firstName,
					lastName,
					email,
					age,
				};

				const gameHistory = {
					totalGamePlayed: '0',
					win: '0',
					loss: '0',
					pointsEarned: '0',
				};

				const userData = {
					userId,
					profileDetails,
					gameHistory,
				};

				const api = APIS['aws-lambda-api-authentication'] + '/create_user';
				const apiStoreUser =
					APIS['cloud-finction-store-user-url'] + '/store_users';

				const apiNewGameSubscription =
					APIS['aws-sns-topic-new-game-subscription-url'];
				const apiGameInviteSubscription =
					APIS['aws-sns-topic-game-invite-subscription-url'];
				const apiTeamInviteSubscription = APIS['lalith-sns-subscribe-api'];

				axios
					.post(api, signUpData)
					.then((response) => {
						if (response) {
							// Handle the success response
							alert('User Created with given details!!');
							navigate('/verification_code', { state: { email } });
						}
					})
					.catch((error) => {
						console.log(error.response.data);
						alert(error.response.data);
					});

				axios
					.post(apiStoreUser, userData)
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

				axios
					.post(apiNewGameSubscription, emailOfIUser)
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
					.post(apiGameInviteSubscription, emailOfIUser)
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
					.post(apiTeamInviteSubscription, { email_id: email })
					.then((response) => {
						if (response) {
							console.log(response);
						} else {
							console.log('Error subscribing');
						}
					})
					.catch((error) => {
						console.log(error);
					});
			}
		}
	};

	return (
		<div>
			<div className="signup-form">
				<h1 className="signup-form-title">Signup</h1>
				<form onSubmit={onSubmit}>
					<label htmlFor="email">Email</label>
					<input
						value={email}
						type="email"
						// required
						onChange={(e) => setEmail(e.target.value)}
					></input>

					<label htmlFor="password">Password</label>
					<input
						value={password}
						type="password"
						// required
						onChange={handlePasswordChange}
					></input>

					<label htmlFor="password">Confirm Password</label>
					<input
						value={confirmPassword}
						type="password"
						// required
						onChange={handleConfirmPasswordChange}
						onBlur={handleConfirmPasswordBlur}
					></input>
					{passwordError && <p>{passwordError}</p>}

					<label htmlFor="first name">First name:</label>
					<input
						value={firstName}
						required
						onChange={(e) => serFirstName(e.target.value)}
					></input>

					<label htmlFor="last name">Last name:</label>
					<input
						value={lastName}
						required
						onChange={(e) => setLastName(e.target.value)}
					></input>

					<label htmlFor="age">Age:</label>
					<input
						value={age}
						required
						onChange={(e) => setAge(e.target.value)}
					></input>

					<button type="submit">SignUp</button>
				</form>
			</div>
		</div>
	);
}

export default SignUp;
