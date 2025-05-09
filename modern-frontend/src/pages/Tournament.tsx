import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  CardActions,
  Link,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import api from '../api';

interface Tournament {
  id: string;
  name: string;
  description: string;
  rounds: number;
  active: boolean;
  public: boolean;
}

const Tournament: React.FC = () => {
  const { tournamentId } = useParams();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const response = await api.get(`/api/tournaments/${tournamentId}/`);
        setTournament(response.data);
      } catch (error) {
        console.error('Error fetching tournament:', error);
      } finally {
        setLoading(false);
      }
    };

    if (tournamentId) {
      fetchTournament();
    }
  }, [tournamentId]);

  if (loading) {
    return (
      <Box sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <Typography>Loading tournament...</Typography>
      </Box>
    );
  }

  if (!tournament) {
    return (
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5">Tournament not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {tournament.name}
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          {tournament.description}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Tournament Details
                </Typography>
                <Typography variant="body1">
                  Number of Rounds: {tournament.rounds}
                </Typography>
                <Typography variant="body1">
                  Status: {tournament.active ? 'Active' : 'Inactive'}
                </Typography>
                <Typography variant="body1">
                  Public Access: {tournament.public ? 'Yes' : 'No'}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to={`/tournament/${tournamentId}/results`}
                >
                  View Results
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Participate
                </Typography>
                <Typography variant="body1">
                  To participate in this tournament, you can:
                </Typography>
                <ul>
                  <li>Register as a team</li>
                  <li>Register as an adjudicator</li>
                  <li>View public results</li>
                </ul>
              </CardContent>
              <CardActions>
                <Button
                  variant="outlined"
                  component={Link}
                  to="/register"
                >
                  Register Now
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Tournament;
