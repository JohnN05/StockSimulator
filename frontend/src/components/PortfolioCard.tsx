import { useNavigate } from 'react-router-dom';
import { Portfolio } from '../types';
import {
    Box,
    Typography
} from "@mui/material";

interface PortfolioCardProps {
    portfolio: Portfolio;
}

export const PortfolioCard: React.FC<PortfolioCardProps> = ({ portfolio }) => {
    const navigate = useNavigate();

    return (
        <Box 
            key = {portfolio.id}
            onClick = {() => navigate(`/account/${portfolio.id}`)}
            sx={{ border:1, p: 3 }}
        >
            <Typography variant = "subtitle2">{portfolio.name}</Typography>
            <Typography variant = "h4">${portfolio.balance.toFixed(2)}</Typography>
        </Box>
    );
}