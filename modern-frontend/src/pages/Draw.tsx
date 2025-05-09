import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
} from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import axios from 'axios';

interface Round {
  id: number;
  round_number: number;
  stage: string;
  active: boolean;
  debates: Debate[];
}

interface Debate {
  id: number;
  venue: string;
  gov_team: string;
  opp_team: string;
  chair: string;
  panellists: string[];
}

interface DrawData {
  rounds: Round[];
  current_round: number;
}

const CustomToolbar = () => {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
};

const Draw: React.FC = () => {
  const [drawData, setDrawData] = useState<DrawData | null>(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRound, setSelectedRound] = useState<number | null>(null);

  const fetchDrawData = async () => {
    try {
      const response = await axios.get('/api/draw/');
      setDrawData(response.data);
    } catch (error) {
      console.error('Error fetching draw data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrawData();
  }, []);

  const handleGenerateDraw = async () => {
    try {
      await axios.post('/api/draw/generate/');
      fetchDrawData();
    } catch (error) {
      console.error('Error generating draw:', error);
    }
  };

  const handlePublishDraw = async () => {
    try {
      await axios.post('/api/draw/publish/', { round: selectedRound });
      fetchDrawData();
      setOpenDialog(false);
    } catch (error) {
      console.error('Error publishing draw:', error);
    }
  };

  if (!drawData || loading) {
    return (
      <Box sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <Typography>Loading draw data...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Draw Management
          </Typography>
          <Button
            variant="contained"
            onClick={handleGenerateDraw}
            startIcon={<SwapHorizIcon />}
          >
            Generate Draw
          </Button>
        </Box>
      </Paper>

      {drawData.rounds.map((round) => (
        <Paper key={round.id} sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Round {round.round_number} - {round.stage}
            </Typography>
            <Box>
              <Button
                variant="outlined"
                onClick={() => {
                  setSelectedRound(round.id);
                  setOpenDialog(true);
                }}
              >
                Publish
              </Button>
            </Box>
          </Box>

          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={round.debates}
              columns={[
                { field: 'venue', headerName: 'Venue', width: 150 },
                { field: 'gov_team', headerName: 'Government', width: 200 },
                { field: 'opp_team', headerName: 'Opposition', width: 200 },
                { field: 'chair', headerName: 'Chair', width: 150 },
                {
                  field: 'panellists',
                  headerName: 'Panellists',
                  width: 200,
                  valueGetter: (params) => params.value.join(', '),
                },
              ]}
              components={{ Toolbar: CustomToolbar }}
              pageSize={10}
              rowsPerPageOptions={[10]}
              checkboxSelection
              disableSelectionOnClick
            />
          </Box>
        </Paper>
      ))}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Publish Draw</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to publish the draw for Round {selectedRound}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handlePublishDraw} color="primary">
            Publish
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Draw;
