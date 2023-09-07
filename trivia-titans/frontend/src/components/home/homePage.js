import React, { useEffect, useState } from 'react';
import './home.css';
import Online from '../onlineUserList/onlineUserList';
import axios, * as others from 'axios';
import { useLocation } from 'react-router-dom';

const Home = () => {
	const [selectedOption, setSelectedOption] = useState('');
	const [countdown, setCountdown] = useState(10);
	const [socketConnection, setsocketConnection] = useState();
	const [sameGamePlayedTimes, setsameGamePlayedTimes] = useState(0);
	const [playerScoreList, setplayerScoreList] = useState([]);
	const [playerOnlineList, setplayerOnlineList] = useState([]);
	const [gameStartStatus, setgameStartStatus] = useState(false);
	const { state } = useLocation();
	var { teamName, quizName } = state;
	const adminStatus = state.isAdmin.toString();

	const playerEmail = state.LoggedInUser;

	let messageToShowInGameWindow = '';
	if (adminStatus == 'true') {
		messageToShowInGameWindow = 'Start The Game';
	} else if (gameStartStatus == true) {
		messageToShowInGameWindow = 'Loading the Game Wait ';
	} else {
		messageToShowInGameWindow = 'wait for admin to start the game';
	}

	const [responsequestion, setresponsequestion] = useState({
		answer: '',
		number: '',
		option1: 'smart',
		option2: 'b00936880nNoQuestion',
		option3: '',
		option4: '',
		question: messageToShowInGameWindow,
		optionShow: true,
	});

	function submitAnswer() {
		console.log('socket' + socketConnection);
		setresponsequestion({
			answer: '',
			number: '',
			option1: 'smart',
			option2: 'b00936880nNoQuestion',
			option3: '',
			option4: '',
			question:
				'Question: ' +
				responsequestion.question +
				'\n' +
				'Answer: ' +
				responsequestion[responsequestion.answer],
			optionShow: true,
		});
		const questionNumber = responsequestion.number;
		const playerAnswer = selectedOption;
		const payload = {
			action: 'getResponseFromClient',
			questionNumber: questionNumber,
			playerAnswer: playerAnswer,
			playerEmail: playerEmail,
			teamName: teamName,
			quizName: quizName,
			sameGamePlayedTimes: sameGamePlayedTimes,
		};

		// Send the JSON payload to the server
		socketConnection.send(JSON.stringify(payload));
	}

	const startTheGameClick = () => {
		const payload = {
			action: 'getSendDataRequestFromClient',
			message: { quizName: quizName, teamName: teamName },
		};
		setgameStartStatus(true);
		// Send the JSON payload to the server
		socketConnection.send(JSON.stringify(payload));
		setresponsequestion({
			answer: '',
			number: '',
			option1: 'smart',
			option2: 'b00936880nNoQuestion',
			option3: '',
			option4: '',
			question: 'Starting the game ',
			optionShow: true,
		});
	};

	let displayBoxes;
	try {
		displayBoxes =
			responsequestion.optionShow ||
			responsequestion.option2 === 'b00936880nNoQuestion' ||
			responsequestion.question === 'Quiz Ended'
				? 'none'
				: 'block';
	} catch (err) {
		displayBoxes = 'none';
	}
	const optionShowStyle = {
		display: displayBoxes,
	};

	function timeLimit(seconds) {
		let remainingTime = seconds;

		const timer = setInterval(() => {
			remainingTime--;
			setCountdown(remainingTime);
			if (remainingTime === 0) {
				clearInterval(timer);
				console.log('Countdown complete!');
			} else {
				console.log(`Remaining time: ${remainingTime} seconds`);
			}
		}, 1000);
	}

	useEffect(() => {
		// Create a new WebSocket instance
		const socket = new WebSocket(
			'wss://ws5bf8ksqi.execute-api.us-east-1.amazonaws.com/production?playerEmail=' +
				playerEmail
		);

		// WebSocket event handlers
		socket.onopen = () => {
			console.log('WebSocket connected');
			// const payload = {"action":"getSendDataRequestFromClient","message":{"quizName":"quiz1","teamName":"spartans"}}
			setsocketConnection(socket);
			// Send the JSON payload to the server
			// socket.send(JSON.stringify(payload));
		};

		socket.onmessage = (event) => {
			const questionData = JSON.parse(event.data);
			setresponsequestion(questionData[0]);
			setSelectedOption('');
			console.log('Received message:', event.data);
			try {
				setsameGamePlayedTimes(questionData[1].gamePlayedTimes);
				setplayerScoreList(questionData[1].playerScoreList);
				setplayerOnlineList(questionData[1].playersOnline);
			} catch (err) {}

			if (questionData[0].question !== 'Quiz Ended') {
				console.log('sss', responsequestion.question);

				console.log('inside timeout');

				timeLimit(10);
			} else {
				setCountdown(10);
			}
		};

		socket.onclose = () => {
			console.log('WebSocket connection closed');
		};

		// Cleanup function to close the WebSocket when the component unmounts
		return () => {
			socket.close();
		};
	}, []);

	function handleOptionChange(event) {
		setSelectedOption(event.target.value);
	}

	return (
		<div class="outerBox">
			<div class="screenWindow">
				<h1 id="questionHeading">{responsequestion.question}</h1>
				<h1>{countdown}</h1>
				<div
					class="answerOptions"
					style={optionShowStyle}
				>
					<li class="options">
						<label>
							<input
								type="radio"
								value="option1"
								checked={selectedOption === 'option1'}
								onChange={handleOptionChange}
							/>
							{responsequestion.option1}
						</label>
					</li>
					<li class="options">
						<label>
							<input
								type="radio"
								value="option2"
								checked={selectedOption === 'option2'}
								onChange={handleOptionChange}
							/>
							{responsequestion.option2}
						</label>
					</li>
					<li class="options">
						<label>
							<input
								type="radio"
								value="option3"
								checked={selectedOption === 'option3'}
								onChange={handleOptionChange}
							/>
							{responsequestion.option3}
						</label>
					</li>
					<li class="options">
						<label>
							<input
								type="radio"
								value="option4"
								checked={selectedOption === 'option4'}
								onChange={handleOptionChange}
							/>
							{responsequestion.option4}
						</label>
					</li>
				</div>
				<button
					style={optionShowStyle}
					id="submitAnswer"
					onClick={submitAnswer}
				>
					submit
				</button>
			</div>
			<div class="onlineList">
				<Online
					playerScoreData={playerScoreList}
					playerOnline={playerOnlineList}
				/>
			</div>
			<div>
				{(adminStatus == 'true' &&
					responsequestion.question === 'Start The Game') ||
				responsequestion.question === 'Loading the Game Wait ' ||
				responsequestion.question === 'Quiz Ended' ? (
					<button
						id="gameStartButton"
						onClick={startTheGameClick}
					>
						Start the Game
					</button>
				) : (
					''
				)}
			</div>
		</div>
	);
};
export default Home;
