import { Portfolio } from '../types';
import {
    Box,
    Typography
} from "@mui/material";

interface PortfolioComponentProps {
    portfolio: Portfolio;
}

export const PortfolioComponent: React.FC<PortfolioComponentProps> = ({ portfolio }) => {
    return (
        <Box sx={{ border:1, p: 3 }}>
            <Typography variant = "subtitle2">{portfolio.name}</Typography>
            <Typography variant = "h4">{portfolio.balance}</Typography>
        </Box>
    );
}