import { Injectable } from '@nestjs/common';
import { IBroker, StocksInfo } from 'src/interfaces';
import * as fs from 'fs';
import { PATH_TO_BROKERS } from 'src/constants';
@Injectable()
export class ListBrokersService {
    private brokers!: IBroker[];

    constructor() {
        const brokersList = fs.readFileSync(PATH_TO_BROKERS);
        this.brokers = JSON.parse(String(brokersList))
    }

    saveJsonData(data: IBroker[]) {
        try {
            fs.writeFileSync(PATH_TO_BROKERS, JSON.stringify(data, null, 2), 'utf-8');
            return true;
        } catch(err) {
            console.error("Ошибка сохранения brokers", err);
            return false;
        }
    }

    getAllBrokers() {
        return this.brokers
    } 
 
    getBrokerById(id: number) {
        const broker = this.brokers.find((broker) => broker.id == id);
        return broker || false;
    }

    createBroker(data: IBroker) {
        const max_id = this.brokers[this.brokers.length - 1].id
        data.id = max_id == undefined ? 0 : max_id + 1;
        data.stocks = [];
        this.brokers.push(data);
        const res = this.saveJsonData(this.brokers)
        if (!res) {
            this.brokers.pop()
            return false
        } 
        return res 
    }


    removeBroker(id: number) {
        console.log(id)
        const preLen = this.brokers.length
        this.brokers = this.brokers.filter(broker => broker.id != id);
        if (this.brokers.length == preLen)
            return false
        return this.saveJsonData(this.brokers)
    }

    changeBrokerData(data: any, id: number) {
        const userIndex = this.brokers.findIndex(user => user.id == id);
        if (userIndex != -1) { 
            const broker = this.brokers[userIndex];
            Object.keys(data).forEach(key => {
                if (key in broker) {
                    if (key == 'balance') {
                        if (data[key] < 0) {
                            data[key] = 0
                        }
                        this.brokers[userIndex][key] = parseInt(data[key]);
                    } else if (key == 'name') {
                        if (data[key].length > 20) {
                            data[key] = data[key].slice(0, 20)
                        }
                        if (data[key] != "") {
                            this.brokers[userIndex][key] = data[key];
                        }       
                    }
                        

                }
            });
            return this.saveJsonData(this.brokers)
        } else {
            console.log(`Брокер с id ${id} не найден`);
            return false
        }
    } 

    updateStocksData(data: StocksInfo, id: number) {
        console.log(data)
        for (let user of this.brokers) {
            if (id == user.id) {
                let isFound = false
                for (let stock of user.stocks) {
                    console.log(stock.label, data.label)
                    if (stock.label == data.label) {
                        isFound = true
                        stock.amount = data.amount
                        stock.date_buy = data.date_buy
                        stock.price = data.price == 'not change' ? stock.price : data.price
                    }
                }
                if (!isFound) {
                    user.stocks.push({
                        amount: data.amount,
                        date_buy: data.date_buy,
                        price: data.price == 'not change' ? 0 : data.price,
                        label: data.label
                    })
                }
            }
        }        
        return this.saveJsonData(this.brokers)
    }


    updateBalance(newBalance: number, id: number) {
        for (let user of this.brokers) {
            if (id == user.id) {
                user.balance = newBalance
            }
        }        
        return this.saveJsonData(this.brokers)
    }


    
}
