export interface IBroker {
    id?: number, 
    name: string,
    balance: number
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