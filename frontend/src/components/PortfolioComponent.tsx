import { useNavigate } from 'react-router-dom';
import { Portfolio } from '../types';
import {
    Box,
    Typography
} from "@mui/material";

interface PortfolioComponentProps {
    portfolio: Portfolio;
}

export const PortfolioComponent: React.FC<PortfolioComponentProps> = ({ portfolio }) => {
    const navigate = useNavigate();

    return (
        <Box 
            key = {portfolio.id}
            onClick = {() => navigate(`/portfolio/${portfolio.id}`)}
            sx={{ border:1, p: 3 }}
        >
            <Typography variant = "subtitle2">{portfolio.name}</Typography>
            <Typography variant = "h4">${portfolio.balance.toFixed(2)}</Typography>
        </Box>
    );
}