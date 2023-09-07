import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import APIS from '../../apis.json';
import { useLocation } from 'react-router-dom';
import './mfaQuestions.css';

function MfaQuestions() {
	const navigate = useNavigate();
	var [answer1, setAnswer1] = useState('');
	var [answer2, setAnswer2] = useState('');
	var [answer3, setAnswer3] = useState('');

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		if (name === 'answer1') {
			setAnswer1(value);
		} else if (name === 'answer2') {
			setAnswer2(value);
		} else if (name === 'answer3') {
			setAnswer3(value);
		}
	};

	const { state } = useLocation();
	const { email } = state;

	const handleSubmit = (e) => {
		e.preventDefault();
		// Reset the form
		setAnswer1('');
		setAnswer2('');
		setAnswer3('');
		const api = APIS['cloud-function-url'] + '/storeUserAnswer';

		const answerObject = {
			userId: email,
			a1: answer1,
			a2: answer2,
			a3: answer3,
		};

		//call mfa answer store api of cloud function
		axios
			.post(api, answerObject)
			.then((res, err) => {
				if (res) {
					alert('Registration Successfull!!');
					navigate('/login');
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<div className="security-questions-form">
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="answer1">What was the name of your first pet?</label>
					<input
						type="text"
						id="answer1"
						name="answer1"
						value={answer1}
						onChange={handleInputChange}
						required
					/>
				</div>
				<div>
					<label htmlFor="answer2">In which city were you born?</label>
					<input
						type="text"
						id="answer2"
						name="answer2"
						value={answer2}
						onChange={handleInputChange}
						required
					/>
				</div>
				<div>
					<label htmlFor="answer3">What is your favorite book or movie?</label>
					<input
						type="text"
						id="answer3"
						name="answer3"
						value={answer3}
						onChange={handleInputChange}
						required
					/>
				</div>
				<button type="submit">Submit</button>
			</form>
		</div>
	);
}

export default MfaQuestions;
