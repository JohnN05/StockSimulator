import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { Ticker, Transaction } from "../types";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface PortfolioHistoryProps {
    portfolioReport : Ticker[]
}

interface EditingTransaction {
    id: number | null;
    date: string;
    symbol: string;
    action: string;
    shares: string;
    price: string;
}

export const PortfolioHistory: React.FC<PortfolioHistoryProps> = ({ portfolioReport}) => {
    const [transactionSortBy, setTransactionSortBy] = useState('date');

    // Get all transactions and sort them
    const sortedTransactions = useMemo(() => {
    const allTransactions = portfolioReport.flatMap(ticker => 
        ticker.transactions.map(transaction => ({
        ...transaction,
        symbol: ticker.symbol
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
    }, [portfolioReport, transactionSortBy]);

      // Transaction editing state
      const [editingTransaction, setEditingTransaction] = useState<EditingTransaction>({
        id: null,
        date: '',
        symbol: '',
        action: '',
        shares: '',
        price: ''
      });


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

    return(

        <Box>
            {/* Transactions Table with Sort and Edit */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 2 }}>
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
                </Box>
            </Box>
            <TableContainer>
            <Table>
                <TableHead>
                <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Symbol</TableCell>
                    <TableCell>Action</TableCell>
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
                                onClick={() => setEditingTransaction({ id: null, date: '', symbol: '', action: '', shares: '', price: '' })}
                            >
                                Cancel
                            </Button>
                            </Box>
                        </TableCell>
                        </>
                    ) : (
                        <>
                        <TableCell>{transaction.date.toLocaleDateString()}</TableCell>
                        <TableCell>{transaction.symbol}</TableCell>
                        <TableCell>{transaction.action}</TableCell>
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
        </Box>
    );
}

export default PortfolioHistory;