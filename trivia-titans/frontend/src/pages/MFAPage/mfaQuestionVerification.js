import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import APIS from '../../apis.json';
import API from '../../interceptors/interceptors';
import axios from 'axios';
import './mfaQuestionVerification.css';

function MfaQuestionVerification() {
	const [answer, setAnswer] = useState('');
	const [questionIndex, setQuestionIndex] = useState(null);

	const navigate = useNavigate();

	const questions = [
		'What is the name of your first pet?',
		'In which city were you born?',
		'What is your favorite book or movie?',
	];

	// Function to select a random question from the list
	const getRandomQuestion = () => {
		const randomIndex = Math.floor(Math.random() * questions.length);
		setQuestionIndex(randomIndex);
	};

	useEffect(() => {
		getRandomQuestion();
		// eslint-disable-next-line
	}, []);

	const { state } = useLocation();
	var { email } = state;

	const api = APIS['cloud-function-url'] + '/validateUserAnswer';

	const answerObject = {
		userId: email,
		answer,
		answerId: `a${questionIndex + 1}`,
	};

	console.log(answerObject);

	// Function to handle form submission
	const handleSubmit = (event) => {
		event.preventDefault();

		//Validate answers
		if (answer === undefined) {
			alert('please provide answer of given question');
		} else {
			//call mfa answer verify api of cloud function
			axios
				.post(api, answerObject)
				.then((res, err) => {
					console.log(res);
					if (res.status === 200) {
						if (email === 'shanikachhadiya013@gmail.com') {
							alert('Verification Successfull!!');
							navigate('/admin_panel');
						} else {
							alert('Verification Successfull!!');
							navigate('/profile');
						}
					} else {
						alert('Verification Unsuccessfull!!');
					}
				})
				.catch((err) => {
					if (err.response && err.response.status === 404) {
						//This will print "Answer not matched!!!."
						alert(err.response.data.message);
						console.log(err.response.data.message);
					}
				});
		}
	};

	return (
		<div className="multi-factor-auth-form">
			<h2>Security Question</h2>
			{questionIndex !== null && (
				<form onSubmit={handleSubmit}>
					<p className="question-login-mfa">{questions[questionIndex]}</p>
					<label>
						<input
							type="text"
							value={answer}
							onChange={(event) => setAnswer(event.target.value)}
						/>
					</label>
					<button type="submit">Submit</button>
				</form>
			)}
		</div>
	);
}

export default MfaQuestionVerification;
