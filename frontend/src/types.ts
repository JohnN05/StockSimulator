export interface User {
    id: number;
    username: string;
    email: string;
    balance: number;
    portfolios: Portfolio[];
}

export interface Portfolio {
    id: number;
    balance: number;
    last_accessed: Date;
    transactions: Transaction[];
}

export interface Transaction {
    id: number;
    ticker: string;
    date: Date;
    price: number;
    shares: number;
    total: number;
}

export interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}