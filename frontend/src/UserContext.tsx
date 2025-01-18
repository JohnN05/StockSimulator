import React, { useEffect, useState } from 'react';
import { User, UserContextType } from './types';
import axios from 'axios';

export const UserContext = React.createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: React.ReactNode;
}

//FOLLOWING SNIPPET IS USED TO CREATE A SINGLE GLOBAL ACCOUNT SHARED BY ALL CLIENTS
const BACKEND_URL = 'http://localhost:5002';

const predefinedCredentials = {
    username: 'defaultUser',
    password: 'defaultPassword'
};

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

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const signIn = async () => {
            try{
                const response = await axios.post(`${BACKEND_URL}/api/user/login`, predefinedCredentials);
                const {token, user} = response.data;
                if (token && user){
                    localStorage.setItem('authToken', token);
                    setUser(parseUser(user));
                }
                
            }catch (error){
                if(axios.isAxiosError(error)){
                    console.error("Login failed", error.response ? error.response.data : error.message);
                } else{
                    console.error("Login failed", error);
                }
            }
        };
        signIn();
    }, []);

    //SNIPPET ENDS HERE

    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    );
}
