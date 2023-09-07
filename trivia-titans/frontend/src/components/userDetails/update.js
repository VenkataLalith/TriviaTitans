import React, { useState, useEffect } from 'react';
import axios, * as others from 'axios';
import './index.css'; // Import the CSS file

const UserDetailsForm = () => {
	const userName = window.localStorage.getItem('LOGGED_IN_USER_USER_EMAIL');
	console.log('start of the function');
	useEffect(() => {
		getdata();
	}, []);

	// ddd const[initialData,setinitialData]= useState({});
	const [userDetails, setUserDetails] = useState({
		firstname: '',
		lastname: '',
		email: '',
		age: '',
	});
	const [gameHistory, setGameHistory] = useState({
		gamePlayedTimes: 0,
		score: 0,
		teamName: 0,
	});

	async function getdata() {
		console.log('getdata get called');
		await axios
			.get(
				'https://us-central1-serverless-kova.cloudfunctions.net/userinfoupdate/getUserData?user=' +
					userName
			)
			.then((response) => {
				console.log(response);
				console.log('initialdata');
				console.log(response.data);
				setUserDetails(response.data.profileDetails);
				setGameHistory(response.data.gameHistory);
			})
			.catch((error) => {
				// Handle any errors that occurred during the request
				console.error(error);
			});
	}

	const handleChange = (e) => {
		setUserDetails({
			...userDetails,
			[e.target.name]: e.target.value,
		});
		console.log('handleChange');
		console.log(userDetails);
	};
	const [readonly, setReadonly] = useState(true);

	const handleSave = () => {
		setReadonly(!readonly);
		console.log('output');
		//console.log(initialData)
		if (!readonly) {
			updateDatabase(userDetails);
		}
	};

	function updateDatabase(userDetails) {
		const postData = {
			docName: userName,
			profileDetails: {
				profileDetails: {
					...userDetails,
				},
			},
		};
		console.log('data update');
		console.log(postData);
		setNewValue(postData);
	}

	function setNewValue(postData) {
		axios
			.post(
				'https://us-central1-serverless-kova.cloudfunctions.net/userinfoupdate/updateUserData',
				postData
			)
			.then((response) => {
				console.log('Response:', response.data);
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	}

	return (
		<div className="container">
			<div className="card1">
				<div className="info">
					<span>User Info</span>
					<button
						id="savebutton"
						onClick={handleSave}
					>
						{readonly ? 'edit' : 'save'}
					</button>
				</div>
				<div className="forms">
					<div className="inputs">
						<span>First Name</span>
						<input
							type="text"
							id="firstname"
							name="firstname"
							readOnly={readonly}
							value={userDetails.firstname}
							onChange={handleChange}
						/>
					</div>
					<div className="inputs">
						<span>Last Name</span>
						<input
							type="text"
							id="lastname"
							name="lastname"
							readOnly={readonly}
							value={userDetails.lastname}
							onChange={handleChange}
						/>
					</div>
					<div className="inputs">
						<span>Email</span>
						<input
							type="email"
							id="email"
							name="email"
							readOnly={readonly}
							value={userDetails.email}
							onChange={handleChange}
						/>
					</div>

					<div className="inputs">
						<span>Age</span>
						<input
							type="number"
							id="age"
							name="age"
							value={userDetails.age}
							onChange={handleChange}
							readOnly={readonly}
						/>
					</div>
				</div>
			</div>
			<div className="card">
				<div className="info">
					<span>GameHistory</span>
				</div>
				<div className="forms">
					<div className="inputs">
						<span>GamePlayedTimes</span>
						<input
							type="text"
							id="gameplayed"
							name="gameplayed"
							readOnly={readonly}
							value={gameHistory.gamePlayedTimes}
							onChange={handleChange}
						/>
					</div>
					<div className="inputs">
						<span>Total points earned</span>
						<input
							type="text"
							id="pointsearned"
							name="pointsearned"
							readOnly={readonly}
							value={gameHistory.score}
							onChange={handleChange}
						/>
					</div>
					<div className="inputs">
						<span>TeamName</span>
						<input
							type="text"
							id="winloss"
							name="winloss"
							readOnly={readonly}
							value={gameHistory.teamName}
							onChange={handleChange}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserDetailsForm;
