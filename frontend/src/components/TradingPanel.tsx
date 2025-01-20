import React, { useContext, useEffect, useRef, useState } from "react"
import { Portfolio, StockData, Ticker } from "../types";
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Button, Paper, Typography, InputAdornment, debounce } from "@mui/material";
import { LineChart } from "@mui/x-charts";
import { DatePicker } from "@mui/x-date-pickers";
import axios from "axios";
import { tickerAvgPrice } from "../portfolioUtil";
import { UserContext } from "../UserContext";

interface TradingPanelProps {
    portfolio : Portfolio
    portfolioReport : Ticker[]
}
const BACKEND_URL = 'http://localhost:5002';

export const TradingPanel: React.FC<TradingPanelProps> = ({ portfolio, portfolioReport }) => {
const userContext = useContext(UserContext);
  if (!userContext){
      throw new Error('UserContext is not found');
  }
  const {user, updatePortfolio} = userContext;

  const [tradeForm, setTradeForm] = useState({
      ticker: '',
      date: new Date(portfolio.date) as Date | null,
      action: '' as '' | 'buy' | 'sell',
      shares: '' as string | number,
      price: '' as string | number,
      total: '' as string | number
    });

  const graphContainerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({width: 0, height: 0});

  const [stockData, setStockData] = useState<StockData>({
  data: [],
  xAxis: { data: [] }
  });

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

  const validSell = (symbol:String, shares:number):boolean => {
    const ticker = portfolioReport.find((cur) => {cur.symbol == symbol});
    return ticker ? ticker.shares >= shares : false;
  }

  const handleTradeSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  console.log(tradeForm);
  const ticker = tradeForm.ticker;
  const date = tradeForm.date;
  const action = tradeForm.action;
  const shares = Number(tradeForm.shares);
  const price = Number(tradeForm.price);
  const total = Number(tradeForm.total);

  if(ticker && date && action 
    && date.getTime() >= new Date(portfolio.date).getTime() 
    && date.getTime() <= new Date().getTime() 
    && shares > 0 && price > 0 
    &&(
      (action == 'buy' && total < portfolio.balance) 
      || (action == 'sell' && validSell(ticker, shares))
    )
  ){
    const token = localStorage.getItem('authToken');
    if (!token){
        console.error("User is not authenticated");
        return;
    }

    try {
        const response = await axios.post(`${BACKEND_URL}/api/trade`, {
        ...tradeForm,
        portfolioId: portfolio.id
        }, {
          headers: {
              'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.status === 200 || response.status === 201){
          const updatedPortfolio: Portfolio = response.data;
          updatePortfolio(updatedPortfolio);
        }


    } catch (error) {
        console.error('Error executing trade:', error);
    }
  }
  
  };

  async function updatePrice() {
  if (tradeForm.ticker) {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/ticker/search`, {
        params: {
          ticker: tradeForm.ticker,
          date: tradeForm.date
        }
      });
      if (response.status === 200) {
        const price = tickerAvgPrice(response.data);
        setTradeForm({ ...tradeForm, price: price, total: price * (tradeForm.shares ? Number(tradeForm.shares) : 0) });
      } else {
        setTradeForm({ ...tradeForm, price: '', total: '' });
      }
      // Reset form or show success message
    } catch (error) {
      console.error('Error fetching price:', error);
    }
  }
}

  useEffect(() => {
    updatePrice();
  }, [tradeForm.date]);

    return (
        <Box>
          <form onSubmit={handleTradeSubmit}>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField 
                label="Ticker Symbol"
                placeholder="Enter symbol"
                variant="outlined"
                value={tradeForm.ticker}
                onBlur={updatePrice}
                onChange={e => setTradeForm({...tradeForm, ticker: e.target.value.toUpperCase()})}
                inputProps={{maxLength: 5}}
                sx={{ flex: 1 }}
              />
              <DatePicker 
                  label="Date" 
                  value={tradeForm.date}
                  onChange={(date) => {
                    setTradeForm({...tradeForm, date: date ? date : null});
                  }}
                  minDate={new Date(portfolio.date)}
                  maxDate={new Date()}
              />
              <TextField
                label="# Shares"
                type="number"
                variant="outlined"
                value={tradeForm.shares}
                onChange={e => setTradeForm({...tradeForm, shares: Number(e.target.value), total: tradeForm.price !== '' ? (Number(e.target.value) * Number(tradeForm.price)).toString() : ''})}
                sx={{ flex: 1 }}
              />
              <FormControl sx={{ flex: 1 }}>
                <InputLabel>Option</InputLabel>
                <Select
                  label="Option"
                  value={tradeForm.action}
                  onChange={e => setTradeForm({...tradeForm, action: e.target.value as '' | 'buy' | 'sell'})}
                >
                  <MenuItem value="">Select Option</MenuItem>
                  <MenuItem value="buy">Buy Stock</MenuItem>
                  <MenuItem value="sell">Sell Stock</MenuItem>
                </Select>
              </FormControl>
              
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>

              <TextField
                label="Share Cost"
                variant="outlined"
                value={tradeForm.price !== null ? "$"+Number(tradeForm.price).toFixed(2) : 'N/A'}
                sx={{ flex: 1 }}
          
                InputProps={{
                  readOnly: true
                }}
              />
              <TextField
                label="Total Cost"
                variant="outlined"
                value={tradeForm.total !== null ? "$"+Number(tradeForm.total).toFixed(2) : 'N/A'}
                sx={{ flex: 1 }}
                InputProps={{
                  readOnly: true
                }}
              />
              <Button 
                variant="contained" 
                color="primary"
                type="submit"
                sx={{ minWidth: '120px' }}
              >
                Confirm
              </Button>
            </Box>
          </form>
    
          {/* Stock Information Display */}
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant="h6">
                {"Company Name (TICKER)"}
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
}

export default TradingPanel;