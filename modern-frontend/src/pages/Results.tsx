import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
} from '@mui/x-data-grid';
import axios from 'axios';

interface DebateResult {
  id: number;
  debate_id: number;
  venue: string;
  gov_team: string;
  opp_team: string;
  gov_score: number;
  opp_score: number;
  gov_speakers: SpeakerScore[];
  opp_speakers: SpeakerScore[];
  adjudicators: AdjudicatorScore[];
}

interface SpeakerScore {
  speaker: string;
  score: number;
}

interface AdjudicatorScore {
  adjudicator: string;
  score: number;
}

const Results: React.FC = () => {
  const [results, setResults] = useState<DebateResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState<DebateResult | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const fetchResults = async () => {
    try {
      const response = await axios.get('/api/results/');
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleOpenResult = (result: DebateResult) => {
    setSelectedResult(result);
    setOpenDialog(true);
  };

  const handleSaveResult = async (result: DebateResult) => {
    try {
      await axios.put(`/api/results/${result.id}/`, result);
      fetchResults();
      setOpenDialog(false);
    } catch (error) {
      console.error('Error saving result:', error);
    }
  };

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  };

  if (loading) {
    return (
      <Box sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <Typography>Loading results...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Results Management
        </Typography>
      </Paper>

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={results}
          columns={[
            { field: 'venue', headerName: 'Venue', width: 150 },
            { field: 'gov_team', headerName: 'Government', width: 200 },
            { field: 'opp_team', headerName: 'Opposition', width: 200 },
            {
              field: 'gov_score',
              headerName: 'Gov Score',
              width: 100,
              type: 'number',
            },
            {
              field: 'opp_score',
              headerName: 'Opp Score',
              width: 100,
              type: 'number',
            },
            {
              field: 'actions',
              headerName: 'Actions',
              width: 100,
              renderCell: (params) => (
                <Button
                  size="small"
                  onClick={() => handleOpenResult(params.row)}
                >
                  Edit
                </Button>
              ),
            },
          ]}
          components={{ Toolbar: CustomToolbar }}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection
          disableSelectionOnClick
        />
      </Box>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Enter Results</DialogTitle>
        <DialogContent>
          {selectedResult && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">{selectedResult.venue}</Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="subtitle1">Government Team</Typography>
                <Typography>{selectedResult.gov_team}</Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="subtitle1">Opposition Team</Typography>
                <Typography>{selectedResult.opp_team}</Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6">Scores</Typography>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Government Score"
                  type="number"
                  value={selectedResult.gov_score}
                  onChange={(e) => {
                    setSelectedResult({
                      ...selectedResult,
                      gov_score: Number(e.target.value),
                    });
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Opposition Score"
                  type="number"
                  value={selectedResult.opp_score}
                  onChange={(e) => {
                    setSelectedResult({
                      ...selectedResult,
                      opp_score: Number(e.target.value),
                    });
                  }}
                />
              </Grid>

              {selectedResult.gov_speakers.map((speaker, index) => (
                <Grid item xs={6} key={index}>
                  <TextField
                    fullWidth
                    label={`Gov Speaker ${index + 1} Score`}
                    type="number"
                    value={speaker.score}
                    onChange={(e) => {
                      const newSpeakers = [...selectedResult.gov_speakers];
                      newSpeakers[index] = {
                        ...newSpeakers[index],
                        score: Number(e.target.value),
                      };
                      setSelectedResult({
                        ...selectedResult,
                        gov_speakers: newSpeakers,
                      });
                    }}
                  />
                </Grid>
              ))}

              {selectedResult.opp_speakers.map((speaker, index) => (
                <Grid item xs={6} key={index}>
                  <TextField
                    fullWidth
                    label={`Opp Speaker ${index + 1} Score`}
                    type="number"
                    value={speaker.score}
                    onChange={(e) => {
                      const newSpeakers = [...selectedResult.opp_speakers];
                      newSpeakers[index] = {
                        ...newSpeakers[index],
                        score: Number(e.target.value),
                      };
                      setSelectedResult({
                        ...selectedResult,
                        opp_speakers: newSpeakers,
                      });
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={() => handleSaveResult(selectedResult!)} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Results;
