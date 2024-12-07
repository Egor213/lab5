import { Controller, Get, Post, Param, Body, Header, Put, Query } from '@nestjs/common';
import { ListBrokersService } from './list-brokers.service';
import { IBroker, StocksInfo } from 'src/interfaces';
@Controller('list-brokers')
export class ListBrokersController {
    constructor(
        private listBrokersServ: ListBrokersService
    ) {}


    @Get()
    @Header('Content-Type', 'application/json')
    getAllBrokers() {
        return this.listBrokersServ.getAllBrokers()
    } 
   
    @Get(':id')
    @Header('Content-Type', 'application/json') 
    getBrokerById(@Param('id') id: number) { 
        return this.listBrokersServ.getBrokerById(id)
    }

    @Post('create')
    createBroker(@Body() brokerData: IBroker) {
        if (!('name' in brokerData) || !('balance' in brokerData)) {
            console.log("Нет полей 'name' или 'balance' в запросе");
            return { message: "Ошибка: поля 'name' и 'balance' отсутствуют!" };
        }        
        this.listBrokersServ.createBroker(brokerData)
        return { message: 'Брокер успешно создан!', brokerData };
    }

    @Put('update-stock/:id')
    updateStock(@Param('id') id: number, @Body() stockData: StocksInfo) {
        if (!('date_buy' in stockData) || !('label' in stockData) || !('price' in stockData) || !('amount' in stockData)) {
            console.log("Нет всех необходимых полей!");
            return { message: "Ошибка: поля отсутствуют!" };
        }  
        if (this.listBrokersServ.updateStocksData(stockData, id))
            return { message: 'Акция обновлена!' };
        else    
            return { error: 'Не удалось обновить акцию!'}
    } 
    

    @Post('delete/:id')
    deleteBroker(@Param('id') id: number) {
        return this.listBrokersServ.removeBroker(id);
    }

    @Put('update-broker/:id')
    updateBroker(@Param('id') id: number, @Body() brokerData: any) {
        return this.listBrokersServ.changeBrokerData(brokerData, id);
    }

    @Put('update-balance/:id')
    updateBalance(@Param('id') id: number, @Query() newBalance: any) {
        if (!('balance' in newBalance)) {
            console.log("Нет параметра balance!");
            return { message: "Ошибка: поле balance отсутствует!" };
        }
        if (this.listBrokersServ.updateBalance(newBalance.balance, id))
            return { message: 'Баланс обновлен!' };
        else    
            return { error: 'Не удалось обновить баланс!'}
    }

}
