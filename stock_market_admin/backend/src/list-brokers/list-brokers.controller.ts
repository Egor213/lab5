import { Controller, Get, Post, Param, Body, Header, Put } from '@nestjs/common';
import { ListBrokersService } from './list-brokers.service';
import { IBroker } from 'src/interfaces';
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

    @Post('delete/:id')
    deleteBroker(@Param('id') id: number) {
        return this.listBrokersServ.removeBroker(id);
    }

    @Put('update-broker/:id')
    updateBroker(@Param('id') id: number, @Body() brokerData: any) {
        return this.listBrokersServ.changeBrokerData(brokerData, id);
    }

}
