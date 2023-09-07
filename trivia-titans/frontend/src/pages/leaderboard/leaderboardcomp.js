import React, { useState, useEffect } from 'react';
import { AppBar, Container, CircularProgress, Toolbar, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);


  const showHighestScoreAlert = (highestScoringPlayer) => {
    if (highestScoringPlayer) {
      const playerID = highestScoringPlayer.playerID;
      const alertShownBefore = localStorage.getItem('HIGHEST_SCORE_ALERT_SHOWN');

      if (!alertShownBefore || JSON.parse(alertShownBefore)[playerID] !== true) {
        const toastProps = { autoClose: 5000, closeOnClick: true };
        toast.success(`${playerID} is leading with highest score!`, toastProps);

        // Update the localStorage to mark that the toast has been shown for this player
        const updatedAlerts = { ...(alertShownBefore ? JSON.parse(alertShownBefore) : {}), [playerID]: true };
        localStorage.setItem('HIGHEST_SCORE_ALERT_SHOWN', JSON.stringify(updatedAlerts));
      }
    }
  };

  useEffect(() => {
     if (playerData.length > 0) {
      const highestScoringPlayer = playerData.find((item) => item.highestScore);
      showHighestScoreAlert(highestScoringPlayer);
    }
 
    // Function to fetch the data from the API
    const fetchData = async () => {
      try {
        // Replace 'apiUrl' with the actual API endpoint URL
        const response = await axios.post('https://lk6s1p6pz9.execute-api.us-east-1.amazonaws.com/default/leaderboard');
        console.log('Data :', response);
        const data = JSON.parse(response.data.body); // Parse the JSON data
        console.log('Data :',data)

        setLeaderboardData(data);
        const highestScoringPlayer = aggregatePlayerData(data).find((item) => item.highestScore);
        showHighestScoreAlert(highestScoringPlayer);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  
  // Function to aggregate player data
  const aggregatePlayerData = (data) => {
    const aggregatedData = {};
    let highestScore = Number.NEGATIVE_INFINITY; // Initialize to negative infinity
    let highestScoringPlayer = null;
    data.forEach((item) => {
      if (aggregatedData[item.playerID]) {
        aggregatedData[item.playerID].score += item.score;
        aggregatedData[item.playerID].gamePlayedTimes += item.gamePlayedTimes;
        aggregatedData[item.playerID].teams.add(item.teamName);
      } else {
        aggregatedData[item.playerID] = {
          playerID: item.playerID,
          score: item.score,
          gamePlayedTimes: item.gamePlayedTimes,
          teams: new Set([item.teamName]),
        };
      }
      if (item.score > highestScore) {
        highestScore = item.score;
        highestScoringPlayer = item.playerID;
      }
    });
    if (highestScoringPlayer) {
    aggregatedData[highestScoringPlayer].highestScore = true;
  }
    return Object.values(aggregatedData);
  };

  // Function to aggregate team data
  const aggregateTeamData = (data) => {
    const aggregatedData = {};
    data.forEach((item) => {
      if (aggregatedData[item.teamName]) {
        aggregatedData[item.teamName].score += item.score;
        aggregatedData[item.teamName].gamePlayedTimes += item.gamePlayedTimes;
        aggregatedData[item.teamName].players.add(item.playerID);
      } else {
        aggregatedData[item.teamName] = {
          teamName: item.teamName,
          score: item.score,
          gamePlayedTimes: item.gamePlayedTimes,
          players: new Set([item.playerID]),
        };
      }
    });
    return Object.values(aggregatedData);
  };

  const playerData = aggregatePlayerData(leaderboardData);
  const teamData = aggregateTeamData(leaderboardData);

  return (
    <div>
      <style>
        {`.highest-score {
          background-color: #f8dbb8;
        }`}
      </style>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6">Leaderboard App</Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ padding: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Leaderboard
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Typography variant="h5" gutterBottom>
              Player Leaderboard
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Player ID</TableCell>
                    <TableCell>Total Score</TableCell>
                    <TableCell>Games Played</TableCell>
                    <TableCell>Teams</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {playerData.map((item, index) => (
                    <TableRow key={index} className={item.highestScore ? 'highest-score' : ''}>
                      <TableCell>{item.playerID}</TableCell>
                      <TableCell>{item.score}</TableCell>
                      <TableCell>{item.gamePlayedTimes}</TableCell>
                      <TableCell>
                        {Array.from(item.teams).join(', ')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Typography variant="h5" gutterBottom>
              Team Leaderboard
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Team Name</TableCell>
                    <TableCell>Total Score</TableCell>
                    <TableCell>Games Played</TableCell>
                    <TableCell>Players</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {teamData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.teamName}</TableCell>
                      <TableCell>{item.score}</TableCell>
                      <TableCell>{item.gamePlayedTimes}</TableCell>
                      <TableCell>
                        {Array.from(item.players).join(', ')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Typography variant="h5" gutterBottom>
              Team Comparison (Bar Chart)
            </Typography>
            <BarChart width={600} height={300} data={teamData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="teamName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="score" fill="#8884d8" name="Total Score" />
              <Bar dataKey="gamePlayedTimes" fill="#82ca9d" name="Games Played" />
            </BarChart>

            <Typography variant="h5" gutterBottom>
              Player Comparison (Bar Chart)
            </Typography>
            <BarChart width={600} height={300} data={playerData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="playerID" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="score" fill="#8884d8" name="Total Score" />
              <Bar dataKey="gamePlayedTimes" fill="#82ca9d" name="Games Played" />
            </BarChart>
          </>
        )}
      </Container>
    </div>
  );
};

export default Leaderboard;
