import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  TextField,
} from '@mui/material';
import { DataGrid, GridColDef, GridApi } from '@mui/x-data-grid';
import { api } from '../api';
import { API_ENDPOINTS } from '../utils/apiEndpoints';

interface Venue {
  id: number;
  name: string;
  address: string;
  capacity: number;
  available: boolean;
}

const Venues: React.FC = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await api.get(API_ENDPOINTS.VENUES.LIST);
        setVenues(response.data);
      } catch (error) {
        setError('Failed to fetch venues');
        console.error('Error fetching venues:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'address', headerName: 'Address', width: 300 },
    { field: 'capacity', headerName: 'Capacity', width: 100 },
    {
      field: 'available',
      headerName: 'Available',
      width: 100,
      renderCell: (params: any) => (
        <Typography
          color={params.value ? 'primary' : 'error'}
        >
          {params.value ? 'Yes' : 'No'}
        </Typography>
      ),
    },
  ];

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Box sx={{ mb: 2 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Venues
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              // TODO: Implement add venue dialog
            }}
          >
            Add Venue
          </Button>
        </Box>
      </Paper>

      <Box sx={{ height: 600, width: '100%' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Typography>Loading venues...</Typography>
          </Box>
        ) : (
          <DataGrid
            rows={venues}
            columns={columns}
            checkboxSelection
            disableSelectionOnClick
          />
        )}
      </Box>
    </Box>
  );
};

export default Venues;
