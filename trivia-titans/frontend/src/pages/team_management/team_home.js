import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { TableHead } from '@mui/material';

const TeamHome = () => {
    const [teamList, setTeamList] = useState([]);
    const [emailId, setEmailId] = useState(window.localStorage.getItem('LOGGED_IN_USER_USER_EMAIL'));
    const [teamName, setTeamName] = useState('');
    const [teamAdmin, setTeamAdmin] = useState('');
    const [teamId, setTeamId] = useState('');
    const [gamesPlayed, setGamesPlayed] = useState();
    const [wins, setWins] = useState();
    const [loss, setLoss] = useState()
    const [points, setPoints] = useState()
    const navigate = useNavigate();

    const handleLeaveTeam = async () => {
        try {

            const payload = {
                team_id: teamId,
                user_id: emailId
            }

            const response = await axios.put('https://lk6s1p6pz9.execute-api.us-east-1.amazonaws.com/default/leaveTeam', payload)
            const { body } = response.data
            alert(body)
            console.log('Response :' + response.data)
        } catch (error) {

        }
    }

    async function handleRemoveMember(email){
        const payload = {
            team_id:teamId,
            user_id:email,
            admin_id:teamAdmin
        }
        const response = await axios.put('https://lk6s1p6pz9.execute-api.us-east-1.amazonaws.com/default/removeUserFromTeam',payload);
        const {body} = response.data
        alert(`${email} :${body}`)
        fetchData();
    }

    async function handlePromoteUser(email){
        const payload = {
            new_admin_id:email,
            team_id:teamId
        }
        const response = await axios.put('https://lk6s1p6pz9.execute-api.us-east-1.amazonaws.com/default/promoteuserasadmin',payload)
        const {body} = response.data
        alert(`${email} :${body}`)
        fetchData();
    }

    const fetchStats = async () => {
        try {
            const payload = {
                admin_user_id: teamAdmin,
                team_name: teamName
            }
            const response = await axios.post('https://lk6s1p6pz9.execute-api.us-east-1.amazonaws.com/default/fetchTeamStats', payload);
            const { wins, loss, games_played, points } = JSON.parse(response.data.body);
            console.log('WIns :' + wins)
            setGamesPlayed(games_played);
            setWins(wins);
            setLoss(loss);
            setPoints(points);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleCreateTeam = async () => {
        const url = 'https://api.openai.com/v1/engines/text-davinci-003/completions';
        const prompt = 'Create a name for  a highly competetive team participating in quiz competetion'; // Customize the prompt
        try {
            const response = await axios.post(url, {
                prompt,
                max_tokens: 20,
                n: 1
            }, {
                headers: {
                    'Authorization': 'Bearer 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',
                    'Content-Type': 'application/json'
                }
            });

            const teamName = response.data.choices[0].text.trim();
            console.log('Generated team name:', teamName);

            const payload = {
                team_name: teamName,
                user_id: emailId
            }
            const teamCreationUrl = 'https://lk6s1p6pz9.execute-api.us-east-1.amazonaws.com/default/createTeamFunction'
            const teamCreationResponse = await axios.post(teamCreationUrl, payload);
            console.log(teamCreationResponse.data)
            const body = JSON.parse(teamCreationResponse.data.body)
            console.log('body :' + body)
            console.log('Messgae :' + body.message)
            alert(`${body.message} with team id : ${body.team_id} and Team Name : ${body.teamName}`)
            setTeamAdmin(emailId);
            setTeamId(body.team_id);
            setTeamName(body.teamName);
            const members = [];
            members.push(emailId);
            setTeamList(members);
            navigate('/team_home')

        } catch (e) {
            console.log('Error :', e)
        }
    }

    const fetchData = async () => {
        try {
            const payload = {
                email_id: emailId
            }
            const response = await axios.post('https://lk6s1p6pz9.execute-api.us-east-1.amazonaws.com/default/fetchTeamList', payload);
            if (response.data.body !== "Email ID not found in team members list") {
                setTeamList(response.data.body.team_members);
                setTeamName(response.data.body.team_name);
                setTeamAdmin(response.data.body.admin_user_id);
                setTeamId(response.data.body.team_id);

            }

            console.log(response.data.body)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    useEffect(() => {
        // Function to fetch the data from API
        console.log(typeof teamList)
        

        fetchData();



    }, []);

    // Render the table or "Create Team" button based on the fetched data
    return (
        <div>
            <AppBar position="static" color="primary">
                <Toolbar>
                    <Typography variant="h6" color="inherit">
                        My Team Page
                    </Typography>
                </Toolbar>
            </AppBar>
            {teamList.length < 1 ? (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <Button variant="contained" color="primary" onClick={handleCreateTeam}>
                        Create Team
                    </Button>
                </div>
            ) : (
                <div>
                    <div>
                        <div style={{ textAlign: 'center', margin: '20px' }}>
                            <h2>Team Name: {teamName}</h2>
                            <p>Admin User: {teamAdmin}</p>
                            <p>Team ID: {teamId}</p>
                            <Button variant="contained" color="primary" onClick={fetchStats} style={{ margin: '20px' }}>
                                Get Stats
                            </Button>
                            <Button variant="contained" color="primary" onClick={() => {navigate(`/team_invite/${emailId}`)}}>
                                Invite User
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleLeaveTeam} style={{ margin: '20px' }}>
                                Leave Team
                            </Button>
                        </div>
                        <TableContainer component={Paper}>
                            <Table>
                                {/* <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            <strong>Team Members</strong>
                                        </TableCell>
                                    </TableRow>
                                    {teamList.map((team, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{team}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody> */}
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            <strong>Team Members</strong>
                                        </TableCell>
                                        {emailId === teamAdmin && <TableCell><strong>Actions</strong></TableCell>}
                                    </TableRow>
                                    {teamList.map((team, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{team}</TableCell>
                                            {emailId === teamAdmin && emailId !== team && (
                                                <TableCell>
                                                    <Button variant="contained" color="error" onClick={() => {handleRemoveMember(team)}}>
                                                        Remove
                                                    </Button>
                                                    <Button variant="contained" color="success" style={{ margin: '15px' }} onClick={() => {handlePromoteUser(team)}}>
                                                        Promote as Admin
                                                    </Button>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                    <div style={{ marginTop: '50px' }}>
                        {wins !== undefined && (
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Games Played</TableCell>
                                            <TableCell>Wins</TableCell>
                                            <TableCell>Loss</TableCell>
                                            <TableCell>Points</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>{gamesPlayed}</TableCell>
                                            <TableCell>{wins}</TableCell>
                                            <TableCell>{loss}</TableCell>
                                            <TableCell>{points}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </div>
                </div>
            )}
        </div>

    );
};

export default TeamHome;
