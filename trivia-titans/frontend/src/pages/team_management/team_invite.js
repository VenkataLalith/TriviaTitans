import React, { useState } from 'react';
import { Card, CardContent, TextField, Button } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useParams,useNavigate } from 'react-router-dom';
import axios from 'axios';

const TeamInvite = () => {
  const navigate = useNavigate();
  const [emailId, setEmailId] = useState('');
  const { data } = useParams();
  const handleSubmit = async() => {
    // Add your logic here to handle form submission with the entered emailId
    const payLoad = {
        fromId:data,
        toId:emailId
    }
    const response = await axios.post('https://nl0wiolbx0.execute-api.us-east-1.amazonaws.com/dev/InviteMemberToTeam',payLoad);
    
    alert(`Sent invitation to ${emailId}`)
    navigate(-1)
    console.log('Submitted email:', emailId);
  };

  return (
   <div style={{margin:"100px"}}> 
   <AppBar position="static" color="primary">
                <Toolbar>
                    <Typography variant="h6" color="inherit">
                        Invite Member
                    </Typography>
                </Toolbar>
            </AppBar>
     <Card>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email ID"
            variant="outlined"
            value={emailId}
            onChange={(e) => setEmailId(e.target.value)}
            fullWidth
          />
          <Button type="submit" variant="contained" color="primary" style={{margin:"20px"}} >
            Invite
          </Button>
        </form>
      </CardContent>
    </Card>
   </div>
  );
};

export default TeamInvite;
