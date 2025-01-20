import axios from "axios";
import { Portfolio, Ticker, TickerInfo, Transaction } from "./types";

const BACKEND_URL = 'http://localhost:5002';

function calculateTotalCost(transactions: Transaction[], shares: number): number{
        let totalCost = 0;
        let i = 0;
        let shareCount = 0
        while (shareCount < shares && i < transactions.length){
            if(transactions[i].action === 'buy'){
                const curShares = Math.min(shares-shareCount, transactions[i].shares);
                totalCost += transactions[i].price * curShares;
                shareCount += curShares
            };
            i++;
        }
        return totalCost
}

async function getTickerOnDate(ticker: String, date: Date): Promise<TickerInfo | undefined> {
    try {
        const response = await axios.get(`${BACKEND_URL}/api/ticker/search`, {
            params: {
                ticker,
                date: new Date(date)
            }
        });
        if (response.status === 200 || response.status === 201) {
            return response.data as TickerInfo;
        }
    } catch (error) {
        console.error(`Failed to fetch ${ticker} on ${date}`, error);
        return undefined;
    }
}

function groupTransactionsByTicker(transactions:Transaction[]): Record<string, Transaction[]>{
    return transactions.reduce((groupedTransactions, transaction) => {
        if(!groupedTransactions[transaction.ticker]){
            groupedTransactions[transaction.ticker] = [];
        }
        groupedTransactions[transaction.ticker].push(transaction);
        return groupedTransactions;
    }, {} as Record<string, Transaction[]>);
}

export async function getTickerSummary(ticker: string, transactions: Transaction[], date: Date): Promise<Ticker> {
    transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());   //sorts transactions from newest to oldest

    const curTicker = await getTickerOnDate(ticker, date);
    const currentPrice = curTicker ? tickerAvgPrice(curTicker) : 0;

    const shares = transactions.reduce((totalShares, transaction) => {
        if(transaction.action === 'buy'){
            return totalShares + transaction.shares;
        } else {
            return totalShares - transaction.shares;
        }
    }, 0);

    const totalCost = calculateTotalCost(transactions, shares);
    const totalValue = shares * currentPrice
    const avgPrice = shares !== 0 ? (totalCost / shares * 100) / 100 : 0;
    const gainLoss = totalValue - totalCost
    const gainLossPercent = totalValue !== 0 ? (gainLoss / totalValue) * 100 : 0
    
    return {
        symbol: ticker,
        shares,
        avgPrice,
        currentPrice,
        totalCost,
        totalValue,
        gainLoss,
        gainLossPercent,
        transactions
    };
}

export async function getPortfolioReport(portfolio: Portfolio): Promise<Ticker[]> {
    const summary: Ticker[] = [];
    const groupedTransactions = groupTransactionsByTicker(portfolio.transactions);
    for (const ticker in groupedTransactions) {
        const transactions = groupedTransactions[ticker];
        const tickerSummary = await getTickerSummary(ticker, transactions, portfolio.date);
        summary.push(tickerSummary);
    }
    return summary;
}

export function tickerAvgPrice(ticker: TickerInfo): number {
    return (ticker.Open + ticker.Close + ticker.High + ticker.Low) / 4
}
