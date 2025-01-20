import { Box, Paper, Typography } from "@mui/material";
import React from "react";
import { OverviewData, Portfolio } from "../types";

interface PortfolioOverviewProps {
    portfolio: Portfolio;
    overviewData: OverviewData;
}

export const PortfolioOverview: React.FC<PortfolioOverviewProps> = ({ portfolio, overviewData }) => {
    return(
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>{portfolio.name}</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="subtitle2">Total Portfolio Value</Typography>
            <Typography variant="h4">${overviewData.totalValue.toFixed(2)}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2">Available Cash</Typography>
            <Typography variant="h4">${portfolio.balance.toFixed(2)}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2">Total Return</Typography>
            <Typography variant="h4">${overviewData.totalReturn.toFixed(2)} ({overviewData.totalReturnPerc.toFixed(2)}%)</Typography>
          </Box>
        </Box>
      </Paper>
    )
}