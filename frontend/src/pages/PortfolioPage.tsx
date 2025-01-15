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
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { LineChart } from '@mui/x-charts/LineChart';
import { useParams } from 'react-router-dom';
import { UserContext } from '../UserContext';

interface Transaction {
  id: string;
  date: string;
  symbol: string;
  action: string;
  orderType: string;
  shares: number;
  price: number;
  total: number;
}

interface EditingTransaction {
  id: string | null;
  date: string;
  symbol: string;
  action: string;
  orderType: string;
  shares: string;
  price: string;
}

interface Portfolio {
  symbol: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  totalCost: number;
  totalValue: number;
  gainLoss: number;
  gainLossPercent: number;
  transactions: Transaction[];
}

interface Account {
  name: string;
  id: string;
}

function PortfolioPage() {
  const getPortfolioById = (id: any) => {
    return user.portfolios.find((portfolio: { id: number; }) => portfolio.id === Number(id));
  };

  const userContext = useContext(UserContext);
  if (!userContext){
      throw new Error('UserContext is not found');
  }
  const { user } = userContext;
  const { id } = useParams()
  const [portfolio, setPortfolio] = useState(getPortfolioById(id));

  // Account Management
  const [accounts, setAccounts] = useState<Account[]>([
    { name: 'Personal Account', id: '1' }
  ]);
  const [selectedAccount, setSelectedAccount] = useState('1');
  const [newAccountName, setNewAccountName] = useState('');
  
  // Available Cash
  const [availableCash, setAvailableCash] = useState('0.00');
  const [isEditingCash, setIsEditingCash] = useState(false);
  const [tempCash, setTempCash] = useState('');

  // Holdings Date
  const [holdingsDate, setHoldingsDate] = useState('');

  // Sorting states
  const [sortBy, setSortBy] = useState('');
  const [transactionSortBy, setTransactionSortBy] = useState('date');

  // Mock Portfolio Data 
  const [portfolioData, setPortfolioData] = useState<Portfolio[]>([
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
          id: '1',
          date: '2023-12-15',
          symbol: 'AAPL',
          action: 'Buy',
          orderType: 'Market',
          shares: 5,
          price: 100.00,
          total: 500.00
        },
        {
          id: '2',
          date: '2023-12-20',
          symbol: 'AAPL',
          action: 'Buy',
          orderType: 'Limit',
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
          id: '3',
          date: '2023-12-10',
          symbol: 'MSFT',
          action: 'Buy',
          orderType: 'Market',
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
          id: '4',
          date: '2023-12-05',
          symbol: 'GOOGL',
          action: 'Buy',
          orderType: 'Market',
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
          id: '5',
          date: '2023-12-01',
          symbol: 'META',
          action: 'Buy',
          orderType: 'Market',
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
          id: '6',
          date: '2023-12-25',
          symbol: 'TSLA',
          action: 'Buy',
          orderType: 'Market',
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
    orderType: '',
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
    const relevantTransactions = sortedTransactions.filter(t => t.date <= date);
    const holdings = new Map<string, { shares: number; totalCost: number }>();
    
    relevantTransactions.forEach(t => {
      const current = holdings.get(t.symbol) || { shares: 0, totalCost: 0 };
      if (t.action === 'buy') {
        holdings.set(t.symbol, {
          shares: current.shares + t.shares,
          totalCost: current.totalCost + t.total
        });
      } else {
        holdings.set(t.symbol, {
          shares: current.shares - t.shares,
          totalCost: current.totalCost - (current.totalCost * (t.shares / current.shares))
        });
      }
    });

    return Array.from(holdings.entries()).reduce((total, [symbol, data]) => {
      const stock = portfolioData.find(p => p.symbol === symbol);
      return total + (stock ? data.shares * stock.currentPrice : 0);
    }, 0);
  };

  // Update portfolio performance when date range changes
  useEffect(() => {
    if (performancePeriod.startDate && performancePeriod.endDate) {
      const startValue = calculatePortfolioValue(performancePeriod.startDate);
      const endValue = calculatePortfolioValue(performancePeriod.endDate);
      const change = endValue - startValue;
      const changePercent = startValue !== 0 ? (change / startValue) * 100 : 0;

      // Generate data points based on interval
      const dataPoints: { date: string; value: number }[] = [];
      let currentDate = new Date(performancePeriod.startDate);
      const endDate = new Date(performancePeriod.endDate);

      while (currentDate <= endDate) {
        dataPoints.push({
          date: currentDate.toISOString().split('T')[0],
          value: calculatePortfolioValue(currentDate.toISOString().split('T')[0])
        });

        // Increment based on interval
        switch (performancePeriod.interval) {
          case 'day':
            currentDate.setDate(currentDate.getDate() + 1);
            break;
          case 'week':
            currentDate.setDate(currentDate.getDate() + 7);
            break;
          case 'month':
            currentDate.setMonth(currentDate.getMonth() + 1);
            break;
          case 'year':
            currentDate.setFullYear(currentDate.getFullYear() + 1);
            break;
        }
      }

      setPortfolioPerformance({
        currentValue: endValue,
        startValue,
        change,
        changePercent,
        dataPoints
      });
    }
  }, [performancePeriod, portfolioData, sortedTransactions]);

  // Handle transaction edit
  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction({
      id: transaction.id,
      date: transaction.date,
      symbol: transaction.symbol,
      action: transaction.action,
      orderType: transaction.orderType,
      shares: transaction.shares.toString(),
      price: transaction.price.toString()
    });
  };

  // Handle transaction save
  const handleSaveTransaction = () => {
    if (!editingTransaction.id) return;

    const updatedTransaction = {
      id: editingTransaction.id,
      date: editingTransaction.date,
      symbol: editingTransaction.symbol,
      action: editingTransaction.action,
      orderType: editingTransaction.orderType,
      shares: parseFloat(editingTransaction.shares),
      price: parseFloat(editingTransaction.price),
      total: parseFloat(editingTransaction.shares) * parseFloat(editingTransaction.price)
    };

    // Update transactions in portfolio data
    const updatedPortfolioData = portfolioData.map(holding => {
      if (holding.symbol === updatedTransaction.symbol) {
        const updatedTransactions = holding.transactions.map(t =>
          t.id === updatedTransaction.id ? updatedTransaction : t
        );
        return {
          ...holding,
          transactions: updatedTransactions
        };
      }
      return holding;
    });

    setPortfolioData(updatedPortfolioData);
    setEditingTransaction({ id: null, date: '', symbol: '', action: '', orderType: '', shares: '', price: '' });
  };

  // Handle transaction delete
  const handleDeleteTransaction = (transactionId: string, symbol: string) => {
    const updatedPortfolioData = portfolioData.map(holding => {
      if (holding.symbol === symbol) {
        return {
          ...holding,
          transactions: holding.transactions.filter(t => t.id !== transactionId)
        };
      }
      return holding;
    });

    setPortfolioData(updatedPortfolioData);
  };

  // Handle add new transaction
  const handleAddTransaction = () => {
    if (!editingTransaction.symbol || !editingTransaction.shares || !editingTransaction.price) return;

    const newTransaction = {
      id: Date.now().toString(),
      date: editingTransaction.date,
      symbol: editingTransaction.symbol.toUpperCase(),
      action: editingTransaction.action,
      orderType: editingTransaction.orderType,
      shares: parseFloat(editingTransaction.shares),
      price: parseFloat(editingTransaction.price),
      total: parseFloat(editingTransaction.shares) * parseFloat(editingTransaction.price)
    };

    // Update or create holding
    let updatedPortfolioData = [...portfolioData];
    const holdingIndex = updatedPortfolioData.findIndex(h => h.symbol === newTransaction.symbol);

    if (holdingIndex >= 0) {
      updatedPortfolioData[holdingIndex].transactions.push(newTransaction);
    } else {
      updatedPortfolioData.push({
        symbol: newTransaction.symbol,
        shares: newTransaction.shares,
        avgPrice: newTransaction.price,
        currentPrice: newTransaction.price,
        totalCost: newTransaction.total,
        totalValue: newTransaction.total,
        gainLoss: 0,
        gainLossPercent: 0,
        transactions: [newTransaction]
      });
    }

    setPortfolioData(updatedPortfolioData);
    setEditingTransaction({ id: null, date: '', symbol: '', action: '', orderType: '', shares: '', price: '' });
    setIsAddingTransaction(false);
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

  const handleCashConfirm = () => {
    const numValue = parseFloat(tempCash.replace(/[^\d.-]/g, ''));
    if (isNaN(numValue)) {
      setTempCash(availableCash);
    } else {
      setAvailableCash(numValue.toFixed(2));
    }
    setIsEditingCash(false);
  };

  const handleCashChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d.]/g, '');
    const parts = value.split('.');
    if (parts.length > 2) return;
    setTempCash(value);
  };

  const handleAddAccount = () => {
    if (newAccountName.trim()) {
      setAccounts([...accounts, { name: newAccountName, id: Date.now().toString() }]);
      setNewAccountName('');
    }
  };

  const handleDeleteAccount = (id: string) => {
    setAccounts(accounts.filter(account => account.id !== id));
    if (selectedAccount === id) {
      setSelectedAccount('');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      

      {/* Account Summary */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Portfolio Summary</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="subtitle2">Total Portfolio Value</Typography>
            <Typography variant="h4">$0.00</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2">Available Cash</Typography>
            <Typography variant="h4">${portfolio.balance.toFixed(2)}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2">Total Return</Typography>
            <Typography variant="h4">$0.00 (0%)</Typography>
          </Box>
        </Box>
      </Paper>

      {/* Portfolio Holdings */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="h6" sx={{ whiteSpace: 'nowrap' }}>Portfolio Holdings as of</Typography>
          <TextField
            type="date"
            value={holdingsDate}
            onChange={(e) => setHoldingsDate(e.target.value)}
            size="small"
            sx={{ width: 150 }}
          />       
        </Box>

        {/* Holdings Table with Sort */}
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-start' }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Sort Holdings By</InputLabel>
            <Select
              value={sortBy}
              label="Sort Holdings By"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="symbol">Symbol (A to Z)</MenuItem>
              <MenuItem value="symbolDesc">Symbol (Z to A)</MenuItem>
              <MenuItem value="sharesAsc">Shares (Low to High)</MenuItem>
              <MenuItem value="sharesDesc">Shares (High to Low)</MenuItem>
              <MenuItem value="priceAsc">Price (Low to High)</MenuItem>
              <MenuItem value="priceDesc">Price (High to Low)</MenuItem>
              <MenuItem value="valueAsc">Value (Low to High)</MenuItem>
              <MenuItem value="valueDesc">Value (High to Low)</MenuItem>
              <MenuItem value="gainLossAsc">Gain/Loss $ (Low to High)</MenuItem>
              <MenuItem value="gainLossDesc">Gain/Loss $ (High to Low)</MenuItem>
              <MenuItem value="gainLossPercentAsc">Gain/Loss % (Low to High)</MenuItem>
              <MenuItem value="gainLossPercentDesc">Gain/Loss % (High to Low)</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Symbol</TableCell>
                <TableCell>Shares</TableCell>
                <TableCell>Avg Price</TableCell>
                <TableCell>Current Price</TableCell>
                <TableCell>Total Cost</TableCell>
                <TableCell>Total Value</TableCell>
                <TableCell>Gain/Loss ($)</TableCell>
                <TableCell>Gain/Loss (%)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedPortfolioData.map((holding) => (
                <TableRow key={holding.symbol}>
                  <TableCell>{holding.symbol}</TableCell>
                  <TableCell>{holding.shares}</TableCell>
                  <TableCell>${holding.avgPrice.toFixed(2)}</TableCell>
                  <TableCell>${holding.currentPrice.toFixed(2)}</TableCell>
                  <TableCell>${holding.totalCost.toFixed(2)}</TableCell>
                  <TableCell>${holding.totalValue.toFixed(2)}</TableCell>
                  <TableCell 
                    sx={{ 
                      color: holding.gainLoss >= 0 ? 'success.main' : 'error.main' 
                    }}
                  >
                    ${holding.gainLoss.toFixed(2)}
                  </TableCell>
                  <TableCell
                    sx={{ 
                      color: holding.gainLossPercent >= 0 ? 'success.main' : 'error.main' 
                    }}
                  >
                    {holding.gainLossPercent.toFixed(2)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Transactions Table with Sort and Edit */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mt: 4, mb: 2 }}>
          <Typography variant="h6">Transaction History</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={transactionSortBy}
                label="Sort By"
                onChange={(e) => setTransactionSortBy(e.target.value)}
              >
                <MenuItem value="date">Date (Most Recent)</MenuItem>
                <MenuItem value="symbol">Company & Date</MenuItem>
              </Select>
            </FormControl>
            <Button 
              variant="contained" 
              onClick={() => {
                setIsAddingTransaction(true);
                setEditingTransaction({ id: null, date: '', symbol: '', action: '', orderType: '', shares: '', price: '' });
              }}
            >
              Add Transaction
            </Button>
          </Box>
        </Box>

        {isAddingTransaction && (
          <Box sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>Add New Transaction</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Symbol"
                value={editingTransaction.symbol}
                onChange={(e) => setEditingTransaction({...editingTransaction, symbol: e.target.value})}
                sx={{ flex: 1 }}
              />
              <TextField
                label="Date"
                type="date"
                value={editingTransaction.date}
                onChange={(e) => setEditingTransaction({...editingTransaction, date: e.target.value})}
                InputLabelProps={{ shrink: true }}
                sx={{ flex: 1 }}
              />
              <FormControl sx={{ flex: 1 }}>
                <InputLabel>Action</InputLabel>
                <Select
                  value={editingTransaction.action}
                  label="Action"
                  onChange={(e) => setEditingTransaction({...editingTransaction, action: e.target.value})}
                >
                  <MenuItem value="Buy">Buy</MenuItem>
                  <MenuItem value="Sell">Sell</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ flex: 1 }}>
                <InputLabel>Order Type</InputLabel>
                <Select
                  value={editingTransaction.orderType}
                  label="Order Type"
                  onChange={(e) => setEditingTransaction({...editingTransaction, orderType: e.target.value})}
                >
                  <MenuItem value="Market">Market</MenuItem>
                  <MenuItem value="Limit">Limit</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Shares"
                type="number"
                value={editingTransaction.shares}
                onChange={(e) => setEditingTransaction({...editingTransaction, shares: e.target.value})}
                sx={{ flex: 1 }}
              />
              <TextField
                label="Price"
                type="number"
                value={editingTransaction.price}
                onChange={(e) => setEditingTransaction({...editingTransaction, price: e.target.value})}
                sx={{ flex: 1 }}
              />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="contained" color="primary" onClick={handleAddTransaction}>
                  Save
                </Button>
                <Button variant="outlined" onClick={() => setIsAddingTransaction(false)}>
                  Cancel
                </Button>
              </Box>
            </Box>
          </Box>
        )}

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Symbol</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Order Type</TableCell>
                <TableCell>Shares</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedTransactions.map((transaction, index) => (
                <TableRow key={`${transaction.symbol}-${index}`}>
                  {editingTransaction.id === transaction.id ? (
                    <>
                      <TableCell>
                        <TextField
                          type="date"
                          value={editingTransaction.date}
                          onChange={(e) => setEditingTransaction({...editingTransaction, date: e.target.value})}
                          size="small"
                          InputLabelProps={{ shrink: true }}
                        />
                      </TableCell>
                      <TableCell>{transaction.symbol}</TableCell>
                      <TableCell>
                        <Select
                          value={editingTransaction.action}
                          onChange={(e) => setEditingTransaction({...editingTransaction, action: e.target.value})}
                          size="small"
                        >
                          <MenuItem value="buy">Buy</MenuItem>
                          <MenuItem value="sell">Sell</MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={editingTransaction.orderType}
                          onChange={(e) => setEditingTransaction({...editingTransaction, orderType: e.target.value})}
                          size="small"
                        >
                          <MenuItem value="market">Market</MenuItem>
                          <MenuItem value="limit">Limit</MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={editingTransaction.shares}
                          onChange={(e) => setEditingTransaction({...editingTransaction, shares: e.target.value})}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={editingTransaction.price}
                          onChange={(e) => setEditingTransaction({...editingTransaction, price: e.target.value})}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        ${(parseFloat(editingTransaction.shares || '0') * parseFloat(editingTransaction.price || '0')).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button size="small" variant="contained" onClick={handleSaveTransaction}>
                            Save
                          </Button>
                          <Button 
                            size="small" 
                            variant="outlined" 
                            onClick={() => setEditingTransaction({ id: null, date: '', symbol: '', action: '', orderType: '', shares: '', price: '' })}
                          >
                            Cancel
                          </Button>
                        </Box>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.symbol}</TableCell>
                      <TableCell>{transaction.action}</TableCell>
                      <TableCell>{transaction.orderType}</TableCell>
                      <TableCell>{transaction.shares}</TableCell>
                      <TableCell>${transaction.price.toFixed(2)}</TableCell>
                      <TableCell>${transaction.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton size="small" onClick={() => handleEditTransaction(transaction)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDeleteTransaction(transaction.id, transaction.symbol)}>
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

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
