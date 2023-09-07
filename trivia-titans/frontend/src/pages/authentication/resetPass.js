import React, { useState } from 'react';
import APIS from '../../apis.json';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './resetPass.css';

const ResetPasswordForm = () => {
	const navigate = useNavigate();
	const [otp, setOtp] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const { state } = useLocation();
	var { email } = state;

	const handleFormSubmit = (e) => {
		e.preventDefault();

		if (!otp || !password || !confirmPassword) {
			alert('Please fill in all fields.');
			return;
		}

		if (password !== confirmPassword) {
			alert('Passwords did not match.');
			return;
		}
		//call api email otp newPassword
		const resetPasswordData = {
			email,
			otp,
			newPassword: confirmPassword,
		};
		const api = APIS['aws-lambda-api-authentication'] + '/confirm_password';

		axios
			.post(api, resetPasswordData)
			.then((response) => {
				if (response.status === 200) {
					alert(response.data.message);
					navigate('/login');
				} else {
					console.log(response.data.message);
				}
			})
			.catch((err) => {
				const errorObject = err.response.data;
				alert(errorObject.error.message);
			});
	};

	return (
		<div className="reset-password-form">
			<h1>Reset Password</h1>
			<form onSubmit={handleFormSubmit}>
				<label>
					OTP:
					<input
						type="text"
						value={otp}
						onChange={(e) => setOtp(e.target.value)}
					/>
				</label>
				<br />
				<label>
					Password:
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</label>
				<br />
				<label>
					Confirm Password:
					<input
						type="password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
				</label>
				<br />
				<button type="submit">Reset Password</button>
			</form>
		</div>
	);
};

export default ResetPasswordForm;
