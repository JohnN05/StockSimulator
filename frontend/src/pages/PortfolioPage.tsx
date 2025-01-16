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
  const [portfolioReport, setPortfolioReport] = useState(portfolio ? getPortfolioReport(portfolio) : {});

  useEffect(() => {
      if (!portfolio){
        navigate('/account')
      } else {
          setPortfolioReport(getPortfolioReport(portfolio));
      }
  }, [portfolio])

  const [tab, setTab] = useState<number>(0);

  // Sorting states
  const [sortBy, setSortBy] = useState('');
  const [transactionSortBy, setTransactionSortBy] = useState('date');

  // Mock Portfolio Data 
  const [portfolioData, setPortfolioData] = useState<Ticker[]>([
    {
      symbol: 'AAPL',
      shares: 10,
      avgPrice: 100.00,
      currentPrice: 110.00,
      totalCost: 1000.00,
      totalValue: 1100.00,
      gainLoss: 100.00,
      gainLossPercent: 10.00,
      transactions: [
        {
          id: 1,
          date: new Date('2023-12-15'),
          ticker: 'AAPL',
          action: 'buy',
          shares: 5,
          price: 100.00,
          total: 500.00
        },
        {
          id: 2,
          date: new Date('2023-12-20'),
          ticker: 'AAPL',
          action: 'buy',
          shares: 5,
          price: 100.00,
          total: 500.00
        }
      ]
    },
    {
      symbol: 'MSFT',
      shares: 5,
      avgPrice: 100.00,
      currentPrice: 90.00,
      totalCost: 500.00,
      totalValue: 450.00,
      gainLoss: -50.00,
      gainLossPercent: -10.00,
      transactions: [
        {
          id: 3,
          date: new Date('2023-12-10'),
          ticker: 'MSFT',
          action: 'buy',
          shares: 5,
          price: 100.00,
          total: 500.00
        }
      ]
    },
    {
      symbol: 'GOOGL',
      shares: 1,
      avgPrice: 1000.00,
      currentPrice: 1100.00,
      totalCost: 1000.00,
      totalValue: 1100.00,
      gainLoss: 100.00,
      gainLossPercent: 10.00,
      transactions: [
        {
          id: 4,
          date: new Date('2023-12-05'),
          ticker: 'GOOGL',
          action: 'buy',
          shares: 1,
          price: 1000.00,
          total: 1000.00
        }
      ]
    },
    {
      symbol: 'META',
      shares: 2,
      avgPrice: 10.00,
      currentPrice: 8.00,
      totalCost: 20.00,
      totalValue: 16.00,
      gainLoss: -4.00,
      gainLossPercent: -20.00,
      transactions: [
        {
          id: 5,
          date: new Date('2023-12-01'),
          ticker: 'META',
          action: 'buy',
          shares: 2,
          price: 10.00,
          total: 20.00
        }
      ]
    },
    {
      symbol: 'TSLA',
      shares: 5,
      avgPrice: 10.00,
      currentPrice: 15.00,
      totalCost: 50.00,
      totalValue: 75.00,
      gainLoss: 25.00,
      gainLossPercent: 50.00,
      transactions: [
        {
          id: 6,
          date: new Date('2023-12-25'),
          ticker: 'TSLA',
          action: 'buy',
          shares: 5,
          price: 10.00,
          total: 50.00
        }
      ]
    }
  ]);

  // Get all transactions and sort them
  const sortedTransactions = useMemo(() => {
    const allTransactions = portfolioData.flatMap(holding => 
      holding.transactions.map(transaction => ({
        ...transaction,
        symbol: holding.symbol
      }))
    );

    if (transactionSortBy === 'date') {
      return allTransactions.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } else {
      return allTransactions.sort((a, b) => {
        const symbolCompare = a.symbol.localeCompare(b.symbol);
        if (symbolCompare !== 0) return symbolCompare;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
    }
  }, [portfolioData, transactionSortBy]);

  // Transaction editing state
  const [editingTransaction, setEditingTransaction] = useState<EditingTransaction>({
    id: null,
    date: '',
    symbol: '',
    action: '',
    shares: '',
    price: ''
  });
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);

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

  // Add Holdings Form
  const [newHolding, setNewHolding] = useState({
    symbol: '',
    shares: '',
    price: '',
    totalValue: '',
    date: '',
    action: '',
    orderType: ''
  });

  // Calculate portfolio value at a given date based on transactions
  const calculatePortfolioValue = (date: string) => {
    // const relevantTransactions = sortedTransactions.filter(t => t.date <= date);
    // const holdings = new Map<string, { shares: number; totalCost: number }>();
    
    // relevantTransactions.forEach(t => {
    //   const current = holdings.get(t.symbol) || { shares: 0, totalCost: 0 };
    //   if (t.action === 'buy') {
    //     holdings.set(t.symbol, {
    //       shares: current.shares + t.shares,
    //       totalCost: current.totalCost + t.total
    //     });
    //   } else {
    //     holdings.set(t.symbol, {
    //       shares: current.shares - t.shares,
    //       totalCost: current.totalCost - (current.totalCost * (t.shares / current.shares))
    //     });
    //   }
    // });

    // return Array.from(holdings.entries()).reduce((total, [symbol, data]) => {
    //   const stock = portfolioData.find(p => p.symbol === symbol);
    //   return total + (stock ? data.shares * stock.currentPrice : 0);
    // }, 0);
  };

  // Update portfolio performance when date range changes
  // useEffect(() => {
  //   if (performancePeriod.startDate && performancePeriod.endDate) {
  //     const startValue = calculatePortfolioValue(performancePeriod.startDate);
  //     const endValue = calculatePortfolioValue(performancePeriod.endDate);
  //     const change = endValue - startValue;
  //     const changePercent = startValue !== 0 ? (change / startValue) * 100 : 0;

  //     // Generate data points based on interval
  //     const dataPoints: { date: string; value: number }[] = [];
  //     let currentDate = new Date(performancePeriod.startDate);
  //     const endDate = new Date(performancePeriod.endDate);

  //     while (currentDate <= endDate) {
  //       dataPoints.push({
  //         date: currentDate.toISOString().split('T')[0],
  //         value: calculatePortfolioValue(currentDate.toISOString().split('T')[0])
  //       });

  //       // Increment based on interval
  //       switch (performancePeriod.interval) {
  //         case 'day':
  //           currentDate.setDate(currentDate.getDate() + 1);
  //           break;
  //         case 'week':
  //           currentDate.setDate(currentDate.getDate() + 7);
  //           break;
  //         case 'month':
  //           currentDate.setMonth(currentDate.getMonth() + 1);
  //           break;
  //         case 'year':
  //           currentDate.setFullYear(currentDate.getFullYear() + 1);
  //           break;
  //       }
  //     }

  //     setPortfolioPerformance({
  //       currentValue: endValue,
  //       startValue,
  //       change,
  //       changePercent,
  //       dataPoints
  //     });
  //   }
  // }, [performancePeriod, portfolioData, sortedTransactions]);

  // Handle transaction edit
  const handleEditTransaction = (transaction: Transaction) => {
    // setEditingTransaction({
    //   id: transaction.id,
    //   date: transaction.date,
    //   symbol: transaction.ticker,
    //   action: transaction.action,
    //   shares: transaction.shares.toString(),
    //   price: transaction.price.toString()
    // });
  };

  // Handle transaction save
  const handleSaveTransaction = () => {
    // if (!editingTransaction.id) return;

    // const updatedTransaction = {
    //   id: editingTransaction.id,
    //   date: editingTransaction.date,
    //   symbol: editingTransaction.symbol,
    //   action: editingTransaction.action,
    //   shares: parseFloat(editingTransaction.shares),
    //   price: parseFloat(editingTransaction.price),
    //   total: parseFloat(editingTransaction.shares) * parseFloat(editingTransaction.price)
    // };

    // // Update transactions in portfolio data
    // const updatedPortfolioData = portfolioData.map(holding => {
    //   if (holding.symbol === updatedTransaction.symbol) {
    //     const updatedTransactions = holding.transactions.map(t =>
    //       t.id === updatedTransaction.id ? updatedTransaction : t
    //     );
    //     return {
    //       ...holding,
    //       transactions: updatedTransactions
    //     };
    //   }
    //   return holding;
    // });

    // setPortfolioData(updatedPortfolioData);
    // setEditingTransaction({ id: null, date: '', symbol: '', action: '', shares: '', price: '' });
  };

  // Handle transaction delete
  const handleDeleteTransaction = (transactionId: number, symbol: string) => {
    // const updatedPortfolioData = portfolioData.map(holding => {
    //   if (holding.symbol === symbol) {
    //     return {
    //       ...holding,
    //       transactions: holding.transactions.filter(t => t.id !== Number(transactionId))
    //     };
    //   }
    //   return holding;
    // });

    // setPortfolioData(updatedPortfolioData);
  };

  // Handle add new transaction
  const handleAddTransaction = () => {
    // if (!editingTransaction.symbol || !editingTransaction.shares || !editingTransaction.price) return;

    // const newTransaction = {
    //   id: 1,
    //   date: editingTransaction.date,
    //   symbol: editingTransaction.symbol.toUpperCase(),
    //   action: editingTransaction.action,
    //   shares: parseFloat(editingTransaction.shares),
    //   price: parseFloat(editingTransaction.price),
    //   total: parseFloat(editingTransaction.shares) * parseFloat(editingTransaction.price)
    // };

    // // Update or create holding
    // let updatedPortfolioData = [...portfolioData];
    // const holdingIndex = updatedPortfolioData.findIndex(h => h.symbol === newTransaction.symbol);

    // if (holdingIndex >= 0) {
    //   updatedPortfolioData[holdingIndex].transactions.push(newTransaction);
    // } else {
    //   updatedPortfolioData.push({
    //     symbol: newTransaction.symbol,
    //     shares: newTransaction.shares,
    //     avgPrice: newTransaction.price,
    //     currentPrice: newTransaction.price,
    //     totalCost: newTransaction.total,
    //     totalValue: newTransaction.total,
    //     gainLoss: 0,
    //     gainLossPercent: 0,
    //     transactions: [newTransaction]
    //   });
    // }

    // setPortfolioData(updatedPortfolioData);
    // setEditingTransaction({ id: null, date: '', symbol: '', action: '', shares: '', price: '' });
    // setIsAddingTransaction(false);
  };

  // Sort portfolio data based on selected option
  const sortedPortfolioData = useMemo(() => {
    if (!sortBy) return portfolioData;
    
    return [...portfolioData].sort((a, b) => {
      switch (sortBy) {
        case 'symbol':
          return a.symbol.localeCompare(b.symbol);
        case 'symbolDesc':
          return b.symbol.localeCompare(a.symbol);
        case 'sharesAsc':
          return a.shares - b.shares;
        case 'sharesDesc':
          return b.shares - a.shares;
        case 'priceAsc':
          return a.currentPrice - b.currentPrice;
        case 'priceDesc':
          return b.currentPrice - a.currentPrice;
        case 'valueAsc':
          return a.totalValue - b.totalValue;
        case 'valueDesc':
          return b.totalValue - a.totalValue;
        case 'gainLossAsc':
          return a.gainLoss - b.gainLoss;
        case 'gainLossDesc':
          return b.gainLoss - a.gainLoss;
        case 'gainLossPercentAsc':
          return a.gainLossPercent - b.gainLossPercent;
        case 'gainLossPercentDesc':
          return b.gainLossPercent - a.gainLossPercent;
        default:
          return 0;
      }
    });
  }, [portfolioData, sortBy]);

  // const handleCashConfirm = () => {
  //   const numValue = parseFloat(tempCash.replace(/[^\d.-]/g, ''));
  //   if (isNaN(numValue)) {
  //     setTempCash(availableCash);
  //   } else {
  //     setAvailableCash(numValue.toFixed(2));
  //   }
  //   setIsEditingCash(false);
  // };

  // const handleCashChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value.replace(/[^\d.]/g, '');
  //   const parts = value.split('.');
  //   if (parts.length > 2) return;
  //   setTempCash(value);
  // };

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
          {portfolio && <PortfolioHoldings portfolio={portfolio} portfolioReport={portfolioData} />}
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <PortfolioHistory portfolioReport={portfolioData} />
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
