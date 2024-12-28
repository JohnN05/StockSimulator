import { useState } from 'react';
import { 
  Box, 
  Container, 
  AppBar, 
  Toolbar, 
  Button,
  Typography
} from '@mui/material';
import AccountPage from './pages/AccountPage';
import TradePage from './pages/TradePage';

function App() {
  const [currentPage, setCurrentPage] = useState<'account' | 'trade'>('account');

  return (
    <Box>
      <AppBar position="static" sx={{ mb: 3 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ mr: 4 }}>
            Stock Simulator
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              color="inherit" 
              onClick={() => setCurrentPage('account')}
              sx={{ 
                textTransform: 'none',
                fontWeight: currentPage === 'account' ? 'bold' : 'normal',
                borderBottom: currentPage === 'account' ? '2px solid white' : 'none',
                borderRadius: 0
              }}
            >
              Account
            </Button>
            <Button 
              color="inherit"
              onClick={() => setCurrentPage('trade')}
              sx={{ 
                textTransform: 'none',
                fontWeight: currentPage === 'trade' ? 'bold' : 'normal',
                borderBottom: currentPage === 'trade' ? '2px solid white' : 'none',
                borderRadius: 0
              }}
            >
              Trade
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth={false} sx={{ p: 2, px: { xs: 4, sm: 6, md: 8, lg: 12 } }}>
        {currentPage === 'account' ? <AccountPage /> : <TradePage />}
      </Container>
    </Box>
  );
}

export default App;
