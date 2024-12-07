export interface IBroker {
    id?: number, 
    name: string,
    balance: number,
    stocks: StocksInfo[]
}

export interface StocksInfo{
    id: number,
    lable: string,
    date_buy: string,
    price: number,
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