import { Box, Button, TextField } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";

const BACKEND_URL = 'http://localhost:5002';

const SignupPage: React.FC = () => {

    const [accountForm, setAccountForm] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    })
    
    const handleSignupSubmit = async (e : React.FormEvent) => {
        e.preventDefault();
        if (accountForm.password !== accountForm.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        try{
            const { confirmPassword, ...params} = accountForm;
            const response = await axios.post(`${BACKEND_URL}/api/user/create`, params)
            console.log(response.data);
        }catch (error){
            console.error(error);
        }
    }

    return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: 3, maxWidth: 400, margin: 'auto', marginTop: 5, boxShadow: 3, borderRadius: 2 }}>
    <h1>Create an account</h1>
        <form onSubmit={handleSignupSubmit}>
            <TextField label="Username"
            placeholder="Enter your username"
            variant="outlined"
            value={accountForm.username}
            onChange={e => setAccountForm({...accountForm, username: e.target.value})}
            />
            <TextField label="Password"
            placeholder="Enter your password"
            variant="outlined"
            type="password"
            value={accountForm.password}
            onChange={e => setAccountForm({...accountForm, password: e.target.value})}
            />
            <TextField label="Confirm Password"
            placeholder="Confirm your password"
            variant="outlined"
            type="password"
            value={accountForm.confirmPassword}
            onChange={e => setAccountForm({...accountForm, confirmPassword: e.target.value})}
            />
            <Button
            variant="contained"
            color="primary"
            type="submit"
            >Create Account</Button>
        </form>
    </Box>

    );
}

export default SignupPage;