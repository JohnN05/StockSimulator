export interface User {
    id: number;
    username: string;
    email: string;
    balance: number;
    portfolios: Portfolio[];
}

export interface Portfolio {
    id: number;
    name: string;
    balance: number;
    date: Date;
    last_accessed: Date;
    transactions: Transaction[];
}

export interface Transaction {
    id: number;
    ticker: string;
    date: Date;
    price: number;
    shares: number;
    action: "buy" | "sell";
    total: number;
}

export interface Ticker {
    symbol: string;
    shares: number;
    avgPrice: number;
    currentPrice: number;
    totalCost: number;
    totalValue: number;
    gainLoss: number;
    gainLossPercent: number;
    transactions: Transaction[];
}

export interface TickerInfo {
    Close: number;
    Date: Date;
    Dividends: number;
    High: number;
    Low: number;
    Open: number;
    Volume: number;
}

export interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}