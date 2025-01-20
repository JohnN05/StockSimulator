import React, { useState, useMemo, useEffect, useContext } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { LineChart } from '@mui/x-charts/LineChart';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { getPortfolioReport } from '../portfolioUtil';
import { Portfolio, Ticker, Transaction } from '../types';
import { PortfolioOverview } from '../components/PortfolioOverview';
import TabPanel from '../components/TabPanel';
import PortfolioHoldings from '../components/PortfolioHoldings';
import PortfolioHistory from '../components/PortfolioHistory';
import TradingPanel from '../components/TradingPanel';

interface EditingTransaction {
  id: number | null;
  date: string;
  symbol: string;
  action: string;
  shares: string;
  price: string;
}

interface Account {
  name: string;
  id: string;
}

function PortfolioPage() {
  const userContext = useContext(UserContext);
  if (!userContext){
      throw new Error('UserContext is not found');
  }
  const navigate = useNavigate();
  const { user } = userContext;
  const { id } = useParams()

  const getPortfolioById = (id: any) => {
    return user?.portfolios.find((portfolio: { id: number; }) => portfolio.id === Number(id));
  };

  const [portfolio, setPortfolio] = useState<Portfolio | undefined>(getPortfolioById(id));
  const [portfolioReport, setPortfolioReport] = useState<Ticker[]>([]);

  useEffect(() => {
    setPortfolio(getPortfolioById(id));
  }, [user])
  useEffect(() => {
      if (!portfolio){
        navigate('/account')
      } else {
          getPortfolioReport(portfolio).then(report => {
            setPortfolioReport(report);
          });
      }
  }, [portfolio])

  const [tab, setTab] = useState<number>(0);

  // Portfolio performance state
  const [performancePeriod, setPerformancePeriod] = useState({
    startDate: '',
    endDate: '',
    interval: 'day'
  });

  const [portfolioPerformance, setPortfolioPerformance] = useState<{
    currentValue: number;
    startValue: number;
    change: number;
    changePercent: number;
    dataPoints: { date: string; value: number }[];
  }>({
    currentValue: 0,
    startValue: 0,
    change: 0,
    changePercent: 0,
    dataPoints: []
  });

  return (
    <Box sx={{ p: 3 }}>
      

      {/* Account Summary */}
      {portfolio && <PortfolioOverview portfolio={portfolio} />}
      <Paper elevation={3} sx={{ p: 3, mb : 3 }}>
        <Tabs 
          value = {tab}
          onChange={(event: React.SyntheticEvent, newTab: number) => {
            setTab(newTab)
          }}
        >
          <Tab label="Holdings" value={0} />
          <Tab label="History" value={1} />
          <Tab label="Trade" value={2} />
        </Tabs>
        <TabPanel value={tab} index={0}>
          {portfolio && <PortfolioHoldings portfolio={portfolio} portfolioReport={portfolioReport} />}
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <PortfolioHistory portfolioReport={portfolioReport} />
        </TabPanel>
        <TabPanel value={tab} index={2}>
          {portfolio && <TradingPanel portfolio={portfolio} portfolioReport={portfolioReport} />}
        </TabPanel>
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }}>
        {/* Performance Period Form and Graph */}
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Typography variant="h4" sx={{ whiteSpace: 'nowrap' }}>
              Portfolio Value: ${portfolioPerformance.currentValue.toFixed(2)}
              {portfolioPerformance.change !== 0 && (
                <Typography component="span" color={portfolioPerformance.change >= 0 ? 'success.main' : 'error.main'}>
                  {` (${portfolioPerformance.change >= 0 ? '+' : ''}${portfolioPerformance.changePercent.toFixed(2)}% / ${portfolioPerformance.change >= 0 ? '+' : ''}$${Math.abs(portfolioPerformance.change).toFixed(2)})`}
                </Typography>
              )}
            </Typography>
            <TextField
              label="Start Date"
              type="date"
              size="small"
              value={performancePeriod.startDate}
              onChange={(e) => setPerformancePeriod({ ...performancePeriod, startDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              sx={{ width: 150 }}
            />
            <TextField
              label="End Date"
              type="date"
              size="small"
              value={performancePeriod.endDate}
              onChange={(e) => setPerformancePeriod({ ...performancePeriod, endDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              sx={{ width: 150 }}
            />
            <FormControl sx={{ width: 120 }} size="small">
              <InputLabel>Interval</InputLabel>
              <Select
                value={performancePeriod.interval}
                onChange={(e) => setPerformancePeriod({ ...performancePeriod, interval: e.target.value })}
                label="Interval"
              >
                <MenuItem value="day">Day</MenuItem>
                <MenuItem value="week">Week</MenuItem>
                <MenuItem value="month">Month</MenuItem>
                <MenuItem value="year">Year</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" size="small" type="submit">
              Submit
            </Button>
          </Box>
          
          {portfolioPerformance.dataPoints.length > 0 ? (
            <Paper elevation={1} sx={{ p: 2 }}>
              <LineChart
                xAxis={[{ 
                  data: portfolioPerformance.dataPoints.map(d => new Date(d.date).getTime()),
                  scaleType: 'time'
                }]}
                series={[{
                  data: portfolioPerformance.dataPoints.map(d => d.value),
                  area: true
                }]}
                height={400}
              />
            </Paper>
          ) : (
            <Paper 
              elevation={1} 
              sx={{ 
                width: '100%', 
                height: 400, 
                bgcolor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Typography color="text.secondary">Select date range and submit to view graph</Typography>
            </Paper>
          )}
        </Box>
      </Paper>
    </Box>
  );
}

export default PortfolioPage;
