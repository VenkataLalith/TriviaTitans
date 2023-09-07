import React, { useState } from 'react';
import APIS from '../../apis.json';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './verificationCode.css';

function VerificationCode() {
	const navigate = useNavigate();
	const [verificationCode, setVerificationCode] = useState('');

	const { state } = useLocation();
	var { email } = state;

	const onSubmit = (e) => {
		e.preventDefault();
		const verificationData = {
			ConfirmationCode: verificationCode,
			email,
		};

		const api = APIS['aws-lambda-api-authentication'] + '/verifyEmail';

		axios
			.post(api, verificationData)
			.then((response) => {
				if (response.status === 200) {
					// Handle the response
					alert('Code verified!!');
					navigate('/mfa', { state: { email } });
				} else {
					alert('Code verification failed!!');
				}
			})
			.catch((error) => {
				// Handle the error
				alert('Invalid verification code');
			});
	};

	return (
		<div className="verification-code-form">
			<form onSubmit={onSubmit}>
				<label htmlFor="email">Verification Code:</label>
				<input
					value={verificationCode}
					onChange={(e) => setVerificationCode(e.target.value)}
				></input>
				<button type="submit">Verify Email</button>
			</form>
		</div>
	);
}

export default VerificationCode;
