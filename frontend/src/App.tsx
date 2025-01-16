import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import TradePage from './pages/TradePage';
import PortfolioPage from './pages/PortfolioPage';
import { useState } from 'react';
import SignupPage from './pages/SignupPage';
import SigninPage from './pages/SigninPage';
import AccountPage from './pages/AccountPage';

function App() {
  const [currentPage, setCurrentPage] = useState<'account' | 'trade' | 'signin' | 'signup'>('account');

  return (
    <Router>
      <Box>
        <AppBar position="static" sx={{ mb: 3, borderRadius: 1 }}>
          <Toolbar>
            <Typography variant="h6" sx={{ mr: 4 }}>
              Stock Simulator
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Link to="/account" style={{ textDecoration: 'none' }}>
                <Button 
                  color="inherit" 
                  onClick={() => setCurrentPage('account')}
                  sx={{ 
                    textTransform: 'none',
                    fontWeight: currentPage === 'account' ? 'bold' : 'normal',
                    borderBottom: currentPage === 'account' ? '2px solid white' : 'none',
                    borderRadius: 0,
                    color: 'white'
                  }}
                >
                  Account
                </Button>
              </Link>
              <Link to="/trade" style={{ textDecoration: 'none' }}>
                <Button 
                  color="inherit"
                  onClick={() => setCurrentPage('trade')}
                  sx={{ 
                    textTransform: 'none',
                    fontWeight: currentPage === 'trade' ? 'bold' : 'normal',
                    borderBottom: currentPage === 'trade' ? '2px solid white' : 'none',
                    borderRadius: 0,
                    color: 'white'
                  }}
                >
                  Trade
                </Button>
              </Link>
              <Link to="/signup" style={{ textDecoration: 'none' }}>
                <Button 
                  color="inherit" 
                  onClick={() => setCurrentPage('signup')}
                  sx={{ 
                    textTransform: 'none',
                    fontWeight: currentPage === 'signup' ? 'bold' : 'normal',
                    borderBottom: currentPage === 'signup' ? '2px solid white' : 'none',
                    borderRadius: 0,
                    color: 'white'
                  }}
                >
                  Sign Up
                </Button>
              </Link>
              <Link to="/signin" style={{ textDecoration: 'none' }}>
                <Button 
                  color="inherit" 
                  onClick={() => setCurrentPage('signin')}
                  sx={{ 
                    textTransform: 'none',
                    fontWeight: currentPage === 'signin' ? 'bold' : 'normal',
                    borderBottom: currentPage === 'signin' ? '2px solid white' : 'none',
                    borderRadius: 0,
                    color: 'white'
                  }}
                >
                  Sign In
                </Button>
              </Link>
            </Box>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 2, px: { xs: 4, sm: 6, md: 8, lg: 12 } }}>
          <Routes>
            <Route path="/" element={<AccountPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path ="/account/:id" element={<PortfolioPage />} />
            <Route path="/trade" element={<TradePage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/signin" element={<SigninPage />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
