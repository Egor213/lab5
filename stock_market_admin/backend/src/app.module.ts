import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ListBrokersService } from './list-brokers/list-brokers.service';
import { ListBrokersController } from './list-brokers/list-brokers.controller';
import { StockService } from './stock/stock.service';
import { StockController } from './stock/stock.controller';
import { HttpModule } from '@nestjs/axios';
import { BiddingGateway } from './bidding.gateway';
@Module({
  imports: [HttpModule],
  controllers: [AppController, ListBrokersController, StockController],
  providers: [AppService, ListBrokersService, StockService, BiddingGateway],
})
export class AppModule {}
