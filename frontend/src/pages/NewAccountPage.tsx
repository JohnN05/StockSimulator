import React, { useContext } from "react";
import { UserContext } from "../UserContext";
import { PortfolioComponent } from "../components/PortfolioComponent";
import {
    Box,
    Button,
    Paper,
    Typography
} from "@mui/material";
import { Portfolio } from "../types";

function NewAccountPage(){
    const userContext = useContext(UserContext);
    if (!userContext){
        throw new Error('UserContext is not found');
    }
    const { user } = userContext;


    return (
        <Box sx={{ p:3}}>
            {
                user ? (
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
                                <Button variant="contained" color="primary" >Add Portfolio</Button>
                            </Box>
                            
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                {user.portfolios.length > 0 ? (user.portfolios.map((portfolio:Portfolio) => (
                                    <PortfolioComponent key={portfolio.id} portfolio={portfolio} />
                                ))
                            ) : (
                                <Typography color="text.secondary" variant="subtitle2">Portfolios will appear here.</Typography>
                            )}
                            </Box>
                        </Paper>
                    </>
                ):
                (
                    <Typography variant="h3" gutterBottom>{`Please sign in`}</Typography>
                )
            }
            {/* Account Summary */}

        </Box>
    )
}

export default NewAccountPage;