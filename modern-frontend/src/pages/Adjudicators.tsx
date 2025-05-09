import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, IconButton, Button } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

interface Adjudicator {
  id: number;
  name: string;
  institution: string;
  test_score: number;
  active: boolean;
}

const Adjudicators: React.FC = () => {
  const [adjudicators, setAdjudicators] = useState<Adjudicator[]>([]);
  const [loading, setLoading] = useState(true);

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'institution', headerName: 'Institution', width: 200 },
    { field: 'test_score', headerName: 'Test Score', width: 150 },
    {
      field: 'active',
      headerName: 'Active',
      width: 100,
      renderCell: (params) => (
        <Typography
          color={params.value ? 'primary' : 'error'}
        >
          {params.value ? 'Yes' : 'No'}
        </Typography>
      ),
    },
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
    const fetchAdjudicators = async () => {
      try {
        const response = await axios.get('/api/adjudicators/');
        setAdjudicators(response.data);
      } catch (error) {
        console.error('Error fetching adjudicators:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdjudicators();
  }, []);

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Adjudicators
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              // TODO: Implement add adjudicator dialog
            }}
          >
            Add Adjudicator
          </Button>
        </Box>
        
        <Box sx={{ mt: 2 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Typography>Loading adjudicators...</Typography>
            </Box>
          ) : (
            <DataGrid
              rows={adjudicators}
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

export default Adjudicators;
