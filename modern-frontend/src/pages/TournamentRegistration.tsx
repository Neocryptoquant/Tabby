import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  TextField,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import api from '../api';
import { API_ENDPOINTS } from '../utils/apiEndpoints';

interface TeamMember {
  name: string;
  email: string;
}

interface RegistrationData {
  team_name: string;
  institution: string;
  members: TeamMember[];
  preferred_venues: string[];
}

const TournamentRegistration: React.FC = () => {
  const { tournamentId } = useParams();
  const [formData, setFormData] = useState<RegistrationData>({
    team_name: '',
    institution: '',
    members: [{ name: '', email: '' }],
    preferred_venues: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [venues, setVenues] = useState<string[]>([]);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await api.get(API_ENDPOINTS.VENUES.LIST);
        setVenues(response.data.map((venue: any) => venue.name));
      } catch (error) {
        console.error('Error fetching venues:', error);
      }
    };

    if (tournamentId) {
      fetchVenues();
    }
  }, [tournamentId]);

  const handleAddMember = () => {
    setFormData({
      ...formData,
      members: [...formData.members, { name: '', email: '' }],
    });
  };

  const handleRemoveMember = (index: number) => {
    if (formData.members.length > 1) {
      const newMembers = [...formData.members];
      newMembers.splice(index, 1);
      setFormData({ ...formData, members: newMembers });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post(API_ENDPOINTS.TEAMS.CREATE, {
        ...formData,
        tournament: tournamentId,
      });
      // Redirect to confirmation page
      window.location.href = `/tournament/${tournamentId}/confirmation`;
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Register for Tournament
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Team Name"
                value={formData.team_name}
                onChange={(e) =>
                  setFormData({ ...formData, team_name: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Institution"
                value={formData.institution}
                onChange={(e) =>
                  setFormData({ ...formData, institution: e.target.value })
                }
              />
            </Grid>

            {formData.members.map((member, index) => (
              <Grid container spacing={2} key={index}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label={`Speaker ${index + 1} Name`}
                    value={member.name}
                    onChange={(e) => {
                      const newMembers = [...formData.members];
                      newMembers[index].name = e.target.value;
                      setFormData({ ...formData, members: newMembers });
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label={`Speaker ${index + 1} Email`}
                    type="email"
                    value={member.email}
                    onChange={(e) => {
                      const newMembers = [...formData.members];
                      newMembers[index].email = e.target.value;
                      setFormData({ ...formData, members: newMembers });
                    }}
                  />
                </Grid>
              </Grid>
            ))}

            <Grid item xs={12}>
              <Button
                variant="outlined"
                onClick={handleAddMember}
                disabled={formData.members.length >= 4}
              >
                Add Another Speaker
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={venues}
                value={formData.preferred_venues}
                onChange={(_, newValue) =>
                  setFormData({ ...formData, preferred_venues: newValue })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Preferred Venues"
                    placeholder="Select preferred venues"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register Team'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default TournamentRegistration;
