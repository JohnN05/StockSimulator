import { 
  Box, 
  Paper, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow 
} from '@mui/material';

function AccountPage() {
  // Mock data for portfolio with just two stocks
  const portfolioData = [
    { symbol: 'AAPL', shares: 10, avgPrice: 100.00, currentPrice: 101.00, totalValue: 1010.00, gain: '+1.0%' },
    { symbol: 'GOOGL', shares: 5, avgPrice: 100.00, currentPrice: 99.00, totalValue: 495.00, gain: '-1.0%' },
  ];

  const totalValue = portfolioData.reduce((sum, stock) => sum + stock.totalValue, 0);

  return (
    <Box>
      {/* Account Summary */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>Account Summary</Typography>
        <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Total Portfolio Value</Typography>
            <Typography variant="h4">${totalValue.toFixed(2)}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Available Cash</Typography>
            <Typography variant="h4">$0.00</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Total Return</Typography>
            <Typography variant="h4" color="success.main">$0.00</Typography>
          </Box>
        </Box>
      </Paper>

      {/* Portfolio */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Portfolio Holdings</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Symbol</TableCell>
                <TableCell align="right">Shares</TableCell>
                <TableCell align="right">Avg Price</TableCell>
                <TableCell align="right">Current Price</TableCell>
                <TableCell align="right">Total Value</TableCell>
                <TableCell align="right">Gain/Loss</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {portfolioData.map((row) => (
                <TableRow key={row.symbol}>
                  <TableCell component="th" scope="row">
                    {row.symbol}
                  </TableCell>
                  <TableCell align="right">{row.shares}</TableCell>
                  <TableCell align="right">${row.avgPrice.toFixed(2)}</TableCell>
                  <TableCell align="right">${row.currentPrice.toFixed(2)}</TableCell>
                  <TableCell align="right">${row.totalValue.toFixed(2)}</TableCell>
                  <TableCell 
                    align="right"
                    sx={{ 
                      color: row.gain.startsWith('+') ? 'success.main' : 'error.main' 
                    }}
                  >
                    {row.gain}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

export default AccountPage;
