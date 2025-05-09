import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Import our custom components
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Teams from './pages/Teams';
import Adjudicators from './pages/Adjudicators';
import Venues from './pages/Venues';
import Draw from './pages/Draw';
import Results from './pages/Results';
import Login from './pages/Login';
import Register from './pages/Register';
import Tournament from './pages/Tournament';
import TournamentRegistration from './pages/TournamentRegistration';
import TournamentConfirmation from './pages/TournamentConfirmation';

// Create a Google-like theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#4285f4',
    },
    secondary: {
      main: '#ea4335',
    },
    background: {
      default: '#f8f9fa',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/tournament/:tournamentId" element={<Tournament />} />
            <Route path="/tournament/:tournamentId/results" element={<Tournament />} />
            <Route path="/tournament/:tournamentId/register" element={<TournamentRegistration />} />
            <Route path="/tournament/:tournamentId/confirmation" element={<TournamentConfirmation />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>              
              <Route path="/" element={
                <Layout>
                  <Box sx={{ mt: 8 }}>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/teams" element={<Teams />} />
                      <Route path="/adjudicators" element={<Adjudicators />} />
                      <Route path="/venues" element={<Venues />} />
                      <Route path="/draw" element={<Draw />} />
                      <Route path="/results" element={<Results />} />
                    </Routes>
                  </Box>
                </Layout>
              } />
            </Route>

            {/* Redirect to login if not authenticated */}
            <Route path="/*" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
