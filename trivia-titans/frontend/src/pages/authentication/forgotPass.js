import React, { useState } from 'react';
import APIS from '../../apis.json';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './forgotPass.css';

function ForgotPass() {
	const [email, setEmail] = useState('');
	const navigate = useNavigate();

	const api = APIS['aws-lambda-api-authentication'] + '/forgot_password';
	const userData = {
		email,
	};
	const handleForgotPasswordSubmit = (e) => {
		e.preventDefault();
		axios
			.post(api, userData)
			.then((response) => {
				if (response.status === 200) {
					alert(response.data.message);
					navigate('/reset_password', { state: { email } });
				} else {
					console.log(response.data.message);
				}
			})
			.catch((error) => {
				console.log(error.response.data);
				alert(error.response.data);
			});
	};
	return (
		<div className="forgot-password-form">
			<h1>Forgot Password</h1>
			<form onSubmit={handleForgotPasswordSubmit}>
				<label>
					Email:
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</label>
				<br />
				<button type="submit">Reset Password</button>
			</form>
		</div>
	);
}

export default ForgotPass;
