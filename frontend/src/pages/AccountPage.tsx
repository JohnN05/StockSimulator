import { useContext, useState } from 'react';
import { UserContext } from "../UserContext";
import { PortfolioCard } from "../components/PortfolioCard";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    InputAdornment,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers';
import { Portfolio } from "../types";
import axios from 'axios';

const BACKEND_URL = 'http://localhost:5002';
const EARLIEST_DATE = new Date('2000-01-01');

function AccountPage(){
    const userContext = useContext(UserContext);
    if (!userContext){
        throw new Error('UserContext is not found');
    }
    const { user } = userContext;

    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true)
    };
    const handleClose = () => setOpen(false);

    const [portfolioForm, setPortfolioForm] = useState<{
        name: string;
        balance: string;
        date: Date | null;
    }>({
        name: '',
        balance: '',
        date: null
    });

    const [nameError, setNameError] = useState(false);
    const [balanceError, setBalanceError] = useState(false);

    const addPortfolio = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        const name = portfolioForm.name.trim();
        const balance = parseFloat(portfolioForm.balance);
        const date = portfolioForm.date;
        if (name && balance && date && date >= EARLIEST_DATE && date <= new Date() && balance > 0){
            const token = localStorage.getItem('authToken');

            if (!token){
                console.error("User is not authenticated");
                return;
            }
            try{
                const response = await axios.post(`${BACKEND_URL}/api/portfolio/create`, {
                    name,
                    balance,
                    date
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.status === 200 || response.status === 201){
                    const newPortfolio: Portfolio = response.data;
                    if (user) {
                        user.portfolios.push(newPortfolio);
                    }
                    handleClose();
                }
            } catch (error){
                if (axios.isAxiosError(error)){
                    console.error("Failed to create portfolio", error.response ? error.response.data : error.message);
                } else {
                    console.error("Failed to create portfolio", error);
                }
            }
            handleClose();
        }
    }

    return (
        <Box sx={{ p:3}}>
            {
                user && (
                    <>
                        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h3" gutterBottom>{`Welcome ${user.username}`}</Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Box>
                                    <Typography variant="subtitle2">Total Portfolio Value</Typography>
                                    <Typography variant="h4">$0.00</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2">Total Return</Typography>
                                    <Typography variant="h4">$0.00 (0%)</Typography>
                                </Box>
                            </Box>
                        </Paper>
            
                        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" gutterBottom>Portfolios</Typography>
                                <Button variant="contained" color="primary" onClick={handleClickOpen} >Add Portfolio</Button>
                            </Box>
                            
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                {user.portfolios.length > 0 ? (user.portfolios.map((portfolio:Portfolio) => (
                                    <PortfolioCard key={portfolio.id} portfolio={portfolio} />
                                ))
                            ) : (
                                <Typography color="text.secondary" variant="subtitle2">Portfolios will appear here.</Typography>
                            )}
                            </Box>
                        </Paper>
                        <Dialog 
                            open={open}
                            onClose={handleClose}
                            PaperProps={{
                                component: 'form',
                                onSubmit: addPortfolio
                                }
                            }
                        >
                            <DialogTitle>New Portfolio</DialogTitle>
                            <DialogContent>
                                <TextField
                                    required
                                    value={portfolioForm.name}
                                    error = {nameError}
                                    margin="dense"
                                    name="name"
                                    label="Portfolio Name"
                                    type="text"
                                    fullWidth
                                    sx = {{ mb: 2 }}
                                    onBlur = {() => {
                                        if (portfolioForm.name){
                                            setNameError(false);
                                        } else {
                                            setNameError(true);
                                        }
                                    }}
                                    onChange = {(e) => setPortfolioForm({...portfolioForm, name: e.target.value})}
                                    
                                />
                                <Box sx={{ display: 'flex', alignItems: 'center', gap:2 }}>
                                    <TextField
                                        required
                                        value={portfolioForm.balance}
                                        error={balanceError}
                                        margin="dense"
                                        name="balance"
                                        label="Starting Balance"
                                        type="number"
                                        InputProps={{
                                            startAdornment: (<InputAdornment position="start">$</InputAdornment>)
                                        }}
                                        onBlur = {() => {
                                            if (portfolioForm.balance && parseFloat(portfolioForm.balance) > 0){
                                                setBalanceError(false);
                                            } else {
                                                setBalanceError(true);
                                            }
                                        }}
                                        onChange = {(e) => setPortfolioForm({...portfolioForm, balance: e.target.value})}
                                    />
                                    <DatePicker 
                                        label="Start Date" 
                                        value = {portfolioForm.date}
                                        onChange = {(date) => setPortfolioForm({...portfolioForm, date})}
                                        minDate={EARLIEST_DATE}
                                        maxDate={new Date()}
                                    />
                                </Box>
                                
                                <DialogActions>
                                    <Button onClick={handleClose}>Cancel</Button>
                                    <Button type="submit">Create</Button>
                                </DialogActions>
                            </DialogContent>

                        </Dialog>
                    </>
                )
            }
            

        </Box>
    )
}

export default AccountPage;