import React, { useMemo, useState } from "react";
import { Portfolio, Ticker } from "../types";
import { Box, FormControl, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { TickerRow } from "./TickerRow";

interface PortfolioHoldingsProps {
    portfolio : Portfolio
    portfolioReport : Ticker[]
}

export const PortfolioHoldings: React.FC<PortfolioHoldingsProps> = ({ portfolio, portfolioReport }) => {
    const [sortBy, setSortBy] = useState('');
    

      // Sort portfolio data based on selected option
      const sortedPortfolioData = useMemo(() => {
        if (!sortBy) return portfolioReport;
        
        return [...portfolioReport].sort((a, b) => {
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
      }, [portfolioReport, sortBy]);
      
    return(
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent:'space-between', gap: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ whiteSpace: 'nowrap' }}>
            Portfolio Holdings as of {portfolio ? new Date(portfolio.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
            </Typography>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-start' }}>
            <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                value={sortBy}
                label="Sort By"
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
        </Box>

            {/* Holdings Table with Sort */}
            

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
                    <TickerRow ticker = {holding}/>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
        </Box>
        
    );
}

export default PortfolioHoldings;