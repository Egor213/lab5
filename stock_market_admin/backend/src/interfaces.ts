export interface IBroker {
    id?: number, 
    name: string,
    balance: number,
    stocks: StocksInfo[]
}

export interface StocksInfo{
    id?: number,
    label: string,
    date_buy: string,
    price: any,
    amount: number
}

export interface IStockHistory {
    Date: number,
    Open: number
}

export interface IStock {
    id: number,
    label: number,
    name: string,
    histoty: IStockHistory[]
}