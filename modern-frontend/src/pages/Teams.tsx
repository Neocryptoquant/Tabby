import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, IconButton, Button } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

interface Team {
  id: number;
  name: string;
  institution: string;
  speaker1: string;
  speaker2: string;
  points: number;
}

const Teams: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Team Name', width: 200 },
    { field: 'institution', headerName: 'Institution', width: 200 },
    { field: 'speaker1', headerName: 'Speaker 1', width: 150 },
    { field: 'speaker2', headerName: 'Speaker 2', width: 150 },
    { field: 'points', headerName: 'Points', width: 100 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <Box>
          <IconButton size="small">
            <EditIcon />
          </IconButton>
          <IconButton size="small" color="error">
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get('/api/teams/');
        setTeams(response.data);
      } catch (error) {
        console.error('Error fetching teams:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Teams
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              // TODO: Implement add team dialog
            }}
          >
            Add Team
          </Button>
        </Box>
        
        <Box sx={{ mt: 2 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Typography>Loading teams...</Typography>
            </Box>
          ) : (
            <DataGrid
              rows={teams}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              checkboxSelection
              disableSelectionOnClick
              sx={{ '& .MuiDataGrid-cell': { borderBottom: '1px solid rgba(0, 0, 0, 0.12)' } }}
            />
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Teams;
