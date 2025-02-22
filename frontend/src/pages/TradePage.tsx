import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { 
  Box, 
  Button, 
  Container, 
  TextField, 
  Paper, 
  Typography, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select 
} from '@mui/material';
import { LineChart } from '@mui/x-charts';

interface StockData {
  data: number[];
  xAxis: {
    data: string[];
  };
}

const BACKEND_URL = 'http://localhost:5002';

const TradePage: React.FC = () => {
  const [tradeForm, setTradeForm] = useState({
    symbol: '',
    date: '',
    option: '',
    orderType: '',
    shares: '',
    totalAmount: ''
  });

  const [searchForm, setSearchForm] = useState({
    symbol: '',
    start: '',
    end: ''
  });

  const [stockData, setStockData] = useState<StockData>({
    data: [],
    xAxis: { data: [] }
  });

  const [dimensions, setDimensions] = useState({width: 0, height: 0});
  const graphContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (graphContainerRef.current) {
        setDimensions({
          width: graphContainerRef.current.offsetWidth,
          height: graphContainerRef.current.offsetHeight
        });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleTradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/trade', {
        ...tradeForm,
        userId: 1 // Replace with actual user ID
      });
      // Reset form or show success message
    } catch (error) {
      console.error('Error executing trade:', error);
    }
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const {symbol, ...params} = searchForm;
      const response = await axios.get(`${BACKEND_URL}/api/ticker/${symbol}`, { params: params });
      const tempData: StockData = {
        data: response.data.map((point: any) => point.Close),
        xAxis: { data: response.data.map((d: any) => d.Date) }
      };
      setStockData(tempData);
    } catch (error) {
      console.error('Error searching stock:', error);
    }
  };

  return (
    <Box>
      {/* Trade Form */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField 
          label="Search Ticker Symbol"
          placeholder="Enter symbol..."
          variant="outlined"
          value={tradeForm.symbol}
          onChange={e => setTradeForm({...tradeForm, symbol: e.target.value})}
          sx={{ flex: 1 }}
        />
        <TextField
          label="Date"
          type="date"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          sx={{ flex: 1 }}
          value={tradeForm.date}
          onChange={e => setTradeForm({...tradeForm, date: e.target.value})}
        />
        <FormControl sx={{ flex: 1 }}>
          <InputLabel>Option</InputLabel>
          <Select
            label="Option"
            value={tradeForm.option}
            onChange={e => setTradeForm({...tradeForm, option: e.target.value})}
          >
            <MenuItem value="">Select Option</MenuItem>
            <MenuItem value="buy">Buy Stock</MenuItem>
            <MenuItem value="sell">Sell Stock</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ flex: 1 }}>
          <InputLabel>Order Type</InputLabel>
          <Select
            label="Order Type"
            value={tradeForm.orderType}
            onChange={e => setTradeForm({...tradeForm, orderType: e.target.value})}
          >
            <MenuItem value="">Select Order Type</MenuItem>
            <MenuItem value="market">Market Price</MenuItem>
            <MenuItem value="limit">Limit Order</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="# Shares"
          type="number"
          variant="outlined"
          value={tradeForm.shares}
          onChange={e => setTradeForm({...tradeForm, shares: e.target.value})}
          sx={{ flex: 1 }}
        />
        <TextField
          label="Total $"
          type="number"
          variant="outlined"
          value={tradeForm.totalAmount}
          onChange={e => setTradeForm({...tradeForm, totalAmount: e.target.value})}
          sx={{ flex: 1 }}
        />
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleTradeSubmit}
          sx={{ minWidth: '120px' }}
        >
          Confirm
        </Button>
      </Box>

      {/* Stock Search Form */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField 
          label="Ticker Symbol"
          placeholder="Enter symbol..."
          variant="outlined"
          value={searchForm.symbol}
          onChange={e => setSearchForm({...searchForm, symbol: e.target.value})}
          sx={{ flex: 1 }}
        />
        <TextField
          label="Start Date"
          type="date"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          sx={{ flex: 1 }}
          value={searchForm.start}
          onChange={e => setSearchForm({...searchForm, start: e.target.value})}
        />
        <TextField
          label="End Date"
          type="date"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          sx={{ flex: 1 }}
          value={searchForm.end}
          onChange={e => setSearchForm({...searchForm, end: e.target.value})}
        />
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleSearchSubmit}
          sx={{ flex: 1 }}
        >
          Search
        </Button>
      </Box>

      {/* Stock Information Display */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="h6">
            {stockData.data.length > 0 ? searchForm.symbol : "Company Name (TICKER)"}
          </Typography>
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
        <Box ref={graphContainerRef} sx={{ width: '100%', height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {stockData.data.length > 0 ? (
            <LineChart
              xAxis={[{ data: stockData.xAxis.data, scaleType: 'point' }]}
              series={[{ data: stockData.data, area: true }]}
              height={dimensions.height}
              width={dimensions.width}
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
};

export default TradePage;
