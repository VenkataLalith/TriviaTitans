import React, { useState, useEffect } from 'react';
import axios, * as others from 'axios';
import './index.css'; // Import the CSS file

const OnLineUserList = ({ playerScoreData, playerOnline }) => {
	const [userOnline, setUserOnline] = useState([]);
	const [userOnlineTimeStamp, setuserOnlineTimeStamp] = useState([]);

	const arrayDataItems = playerScoreData.map((item, index) => (
		<li key={playerScoreData[index]}>
			<span>{playerScoreData[index][0]}</span>
			<span className="timeStampData"> {playerScoreData[index][1]}</span>
			<span className="timeStampData"> {playerScoreData[index][2]}</span>{' '}
		</li>
	));

	const playerOnlineList = playerOnline.map((item, index) => (
		<li key={playerOnline[index]}>
			<span>{playerOnline[index]}</span>
		</li>
	));
	return (
		<div className="container">
			<div className="card2">
				<div className="info">
					<span>Live Score </span>
				</div>
				<div class="userList">
					<span class="userName">Player</span> <span>Score</span>{' '}
					<span>TeamName</span>
					<ul>
						{/* {playerScoreData} */}
						{arrayDataItems}
					</ul>
				</div>
			</div>

			<div className="card3">
				<div className="info">
					<span>Players Online</span>
				</div>
				<div class="userList">
					<ul>
						{/* {playerScoreData} */}
						{playerOnlineList}
					</ul>
				</div>
			</div>
		</div>
	);
};

export default OnLineUserList;
