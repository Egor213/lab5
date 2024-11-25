import { Controller, Get, Param } from '@nestjs/common';
import { StockService } from './stock.service';

@Controller('stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get('/')
  getAllStocks() {
    return this.stockService.getStock();
  }

  @Get('/:id')
  getStock(@Param('id') id: number) {
    return this.stockService.getStock(id);
  }
}
