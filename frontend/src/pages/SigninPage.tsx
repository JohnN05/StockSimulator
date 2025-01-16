import { Box, Button, TextField } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { User } from "../types";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = 'http://localhost:5002';

const SigninPage: React.FC = () => {
    const navigate = useNavigate();

    const userContext = useContext(UserContext);
    if (!userContext){
        throw new Error('UserContext is not found');
    }
    const { setUser } = userContext;

    const [signinForm, setSigninForm] = useState({
        username: '',
        password: ''
    })

    const parseUser = (user: any): User => ({
        ...user,
        portfolios: user.portfolios.map((portfolio: any) => ({
            ...portfolio,
            last_accessed: new Date(portfolio.last_accessed),
            transactions: portfolio.transactions.map((transaction: any) => ({
                id: transaction.id,
                ticker: transaction.ticker,
                date: new Date(transaction.date),
                price: transaction.price,
                shares: transaction.shares,
                total: transaction.total
            }))
        }))
    });
    
    const handleSigninSubmit = async (e : React.FormEvent) => {
        e.preventDefault();
        // Validate form data
        if (!signinForm.username || !signinForm.password) {
            console.error("Username and password are required");
            return;
        }
        
        try{
            const response = await axios.post(`${BACKEND_URL}/api/user/login`, signinForm);
            const {token, user} = response.data;
            if (token && user){
                localStorage.setItem('authToken', token);
                setUser(parseUser(user));
                navigate('/account')
            }
            
            
        }catch (error){
            if(axios.isAxiosError(error)){
                console.error("Login failed", error.response ? error.response.data : error.message);
            } else{
                console.error("Login failed", error);
            }
        }
    }

    return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: 3, maxWidth: 400, margin: 'auto', marginTop: 5, boxShadow: 3, borderRadius: 2 }}>
    <h1>Sign In</h1>
        <form onSubmit={handleSigninSubmit}>
            <TextField label="Username"
            placeholder="Enter your username"
            variant="outlined"
            value={signinForm.username}
            onChange={e => setSigninForm({...signinForm, username: e.target.value})}
            />
            <TextField label="Password"
            placeholder="Enter your password"
            variant="outlined"
            type="password"
            value={signinForm.password}
            onChange={e => setSigninForm({...signinForm, password: e.target.value})}
            />
            <Button
            variant="contained"
            color="primary"
            type="submit"
            >Sign In</Button>
        </form>
    </Box>

    );
}

export default SigninPage;
