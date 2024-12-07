import { Injectable } from '@nestjs/common';
import { PATH_TO_STOCKS } from 'src/constants';
import * as fs from 'fs';
import { IStock } from 'src/interfaces';

@Injectable()
export class StockService {
    private stocks!: IStock[];
    
    constructor() {
        const brokersList = fs.readFileSync(PATH_TO_STOCKS);
        this.stocks = JSON.parse(String(brokersList))
    }

  getStock(id?: number) {
    if (!id) 
        return this.stocks
    for (let stock of this.stocks) {
        if (stock.id == id) {
            return stock
        }
    }
    return false
  }
    
    
}
