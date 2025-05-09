import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, Card, CardContent, LinearProgress, Alert } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import api from '../api';
import { API_ENDPOINTS } from '../utils/apiEndpoints';

interface TournamentStats {
  teams: number;
  adjudicators: number;
  venues: number;
  rounds: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<TournamentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get(API_ENDPOINTS.TOURNAMENTS.LIST);
        if (response.data.length > 0) {
          const tournament = response.data[0];
          setStats({
            teams: tournament.teams_count || 0,
            adjudicators: tournament.adjudicators_count || 0,
            venues: tournament.venues_count || 0,
            rounds: tournament.rounds || 0,
          });
        }
      } catch (error) {
        setError('Failed to fetch tournament statistics');
        console.error('Error fetching tournament stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsCards = [
    { title: 'Teams', value: stats?.teams || 0 },
    { title: 'Adjudicators', value: stats?.adjudicators || 0 },
    { title: 'Venues', value: stats?.venues || 0 },
    { title: 'Rounds', value: stats?.rounds || 0 },
  ];

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {loading && <LinearProgress sx={{ mb: 2 }} />}
      <Grid container spacing={3}>
        {statsCards.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  {stat.title}
                </Typography>
                <Typography variant="h4" component="div">
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Recent Updates
        </Typography>
        <Paper sx={{ p: 2 }}>
          <Typography variant="body1">
            No recent updates available
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard;
