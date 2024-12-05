import { Injectable } from '@nestjs/common';
import { IBroker } from 'src/interfaces';
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
    
}
