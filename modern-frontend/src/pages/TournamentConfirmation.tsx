import React, { useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Chip,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import api from '../api';
import { API_ENDPOINTS } from '../utils/apiEndpoints';

interface RegistrationData {
  team_name: string;
  institution: string;
  members: Array<{ name: string; email: string }>;
  preferred_venues: string[];
}

const TournamentConfirmation: React.FC = () => {
  const { tournamentId } = useParams();
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistration = async () => {
      try {
        const response = await api.get(
          `${API_ENDPOINTS.TEAMS.LIST}?tournament=${tournamentId}`
        );
        if (response.data.length > 0) {
          setRegistrationData(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching registration data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (tournamentId) {
      fetchRegistration();
    }
  }, [tournamentId]);

  if (loading) {
    return (
      <Box sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <Typography>Loading registration details...</Typography>
      </Box>
    );
  }

  if (!registrationData) {
    return (
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5">Registration not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Registration Confirmation
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6">Team Information</Typography>
            <Typography variant="body1">
              Team Name: {registrationData.team_name}
            </Typography>
            <Typography variant="body1">
              Institution: {registrationData.institution}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6">Team Members</Typography>
            {registrationData.members.map((member, index) => (
              <Chip
                key={index}
                label={`${member.name} (${member.email})`}
                sx={{ m: 1 }}
              />
            ))}
          </Grid>

          {registrationData.preferred_venues.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6">Preferred Venues</Typography>
              {registrationData.preferred_venues.map((venue: string) => (
                <Chip label={venue} sx={{ m: 1 }} />
              ))}
            </Grid>
          )}

          <Grid item xs={12}>
            <Typography variant="body1" color="textSecondary">
              Thank you for registering! You will receive further instructions via email.
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              component="a"
              href={`/tournament/${tournamentId}`}
              sx={{ mt: 2 }}
            >
              Back to Tournament
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default TournamentConfirmation;
