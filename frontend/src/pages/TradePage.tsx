import { useState } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  TextField, 
  Paper, 
  Typography, 
  MenuItem 
} from '@mui/material';
import { LineChart } from '@mui/x-charts';

interface StockData {
  data: number[];
  xAxis: {
    data: string[];
  };
}

function TradePage() {
  const [stockData, setStockData] = useState<StockData>({
    data: [],
    xAxis: { data: [] }
  });

  const [formData, setFormData] = useState({
    ticker: '',
    date: '',
    option: '',
    orderType: '',
    shares: '',
    total: ''
  });

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`/api/search?ticker=${formData.ticker}&date=${formData.date}`);
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };

  return (
    <Box>
      {/* Search Section */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField 
          label="Search Ticker Symbol"
          variant="outlined"
          value={formData.ticker}
          onChange={handleInputChange('ticker')}
          sx={{ flex: 2 }}
        />
        <TextField
          label="Date"
          type="date"
          variant="outlined"
          value={formData.date}
          onChange={handleInputChange('date')}
          InputLabelProps={{ shrink: true }}
          sx={{ flex: 1 }}
        />
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleSubmit}
          sx={{ minWidth: '120px' }}
        >
          Submit
        </Button>
      </Box>

      {/* Trade Options Section */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          select
          label="Option"
          variant="outlined"
          value={formData.option}
          onChange={handleInputChange('option')}
          fullWidth
        >
          <MenuItem value="">Select Option</MenuItem>
          <MenuItem value="buy">Buy Stock</MenuItem>
          <MenuItem value="sell">Sell Stock</MenuItem>
        </TextField>
        <TextField
          select
          label="Order Type"
          variant="outlined"
          value={formData.orderType}
          onChange={handleInputChange('orderType')}
          fullWidth
        >
          <MenuItem value="">Select Order Type</MenuItem>
          <MenuItem value="market">Market Price</MenuItem>
          <MenuItem value="limit">Limit Order</MenuItem>
        </TextField>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="# Shares"
          type="number"
          variant="outlined"
          value={formData.shares}
          onChange={handleInputChange('shares')}
          sx={{ flex: 1 }}
        />
        <TextField
          label="Total $$"
          type="number"
          variant="outlined"
          value={formData.total}
          InputProps={{
            readOnly: true,
          }}
          sx={{ flex: 1 }}
        />
        <Button 
          variant="contained" 
          color="secondary"
          sx={{ minWidth: '120px' }}
        >
          Confirm
        </Button>
      </Box>

      {/* Stock Information Display */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="h6">
            Company Name (TICKER)
          </Typography>
          <TextField
            label="Start Date"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
            sx={{ width: 150 }}
          />
          <TextField
            label="End Date"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
            sx={{ width: 150 }}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography variant="subtitle1">
            Price: $0.00
          </Typography>
          <Typography 
            variant="subtitle1"
            sx={{ 
              color: '0' === '0' ? 'text.secondary' : '0'.startsWith('+') ? 'success.main' : 'error.main',
              fontWeight: 'medium'
            }}
          >
            (0%)
          </Typography>
        </Box>
        
        {/* Stock Price Chart */}
        <Box sx={{ width: '100%', height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {stockData.data.length > 0 ? (
            <LineChart
              xAxis={[{ data: stockData.xAxis.data, scaleType: 'point' }]}
              series={[{ data: stockData.data, area: true }]}
              height="100%"
              width="100%"
            />
          ) : (
            <Typography variant="body1" color="textSecondary">
              No data available. Search for a stock to view its price chart.
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
}

export default TradePage;
