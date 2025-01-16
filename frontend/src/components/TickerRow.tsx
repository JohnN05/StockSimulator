import { TableCell, TableRow } from "@mui/material";
import { Ticker } from "../types";

interface TickerRowProps {
    ticker: Ticker;
}

export const TickerRow: React.FC<TickerRowProps> = ({ ticker }) => {

    return (
        <TableRow key={ticker.symbol}>
            <TableCell>{ticker.symbol}</TableCell>
            <TableCell>{ticker.shares}</TableCell>
            <TableCell>${ticker.avgPrice !== null && ticker.avgPrice !== undefined ? ticker.avgPrice.toFixed(2) : 'N/A'}</TableCell>
            <TableCell>${ticker.currentPrice != null ? ticker.currentPrice.toFixed(2) : 'N/A'}</TableCell>
            <TableCell>${ticker.totalCost !== null && ticker.totalCost !== undefined ? ticker.totalCost.toFixed(2) : 'N/A'}</TableCell>
            <TableCell>${ticker.totalValue !== null && ticker.totalValue !== undefined ? ticker.totalValue.toFixed(2) : 'N/A'}</TableCell>
            <TableCell 
            sx={{ 
                color: ticker.gainLoss >= 0 ? 'success.main' : 'error.main' 
            }}
            >
            ${ticker.gainLoss !== null && ticker.gainLoss !== undefined ? ticker.gainLoss.toFixed(2) : 'N/A'}
            </TableCell>
            <TableCell
            sx={{ 
                color: ticker.gainLossPercent >= 0 ? 'success.main' : 'error.main' 
            }}
            >
            {ticker.gainLossPercent !== null && ticker.gainLossPercent !== undefined ? ticker.gainLossPercent.toFixed(2) : 'N/A'}%
            </TableCell>
        </TableRow>
    );
}