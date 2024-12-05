import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from "socket.io";
import * as fs from 'fs';

@WebSocketGateway(4001, { transports: ['websocket'] })
export class BiddingGateway {
  @WebSocketServer() private server: Server;
  private maxDate: Date = new Date('2024-11-23');
  private currentDate = '';
  private intervalId: NodeJS.Timeout | null = null; 


  @SubscribeMessage('startTrading')
  handleStartTrading(
    @MessageBody() data: { startDate: string, tradeSpeed: number, stocksList: string },
    @ConnectedSocket() socket: Socket
  ): void {
    const { startDate, tradeSpeed, stocksList } = data;
    this.beginTrading(tradeSpeed, stocksList, socket, startDate);
  }

  @SubscribeMessage('closeTrading')
  closeTrading(socket: Socket): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      console.log('Торговля завершена по запросу');
    }
  }

  private beginTrading(tradeSpeed: number, stocksList: string, client: Socket, startDate: string) {
    let currentDate: string = startDate;
    console.log(currentDate)
    this.intervalId = setInterval(() => {
      let normList = stocksList.split(',');
      let answer: any = {};
      for (let label of normList) {
        answer[label] = this.getPrice(currentDate, label);
      }
      const date = new Date(currentDate);
      date.setDate(date.getDate() + 1);
      currentDate = date.toISOString().split('T')[0];
      console.log(currentDate);
      if (answer) {
        client.emit('tradeUpdate', {
          currentDate: currentDate,
          stockPrices: answer
        });
      }

      if (new Date(this.currentDate) > this.maxDate) {
        clearInterval(this.intervalId); 
        console.log('Торговля завершена.');
      }

    }, tradeSpeed * 500); 
  }

  getPrice(date: string, label: string) {
    const data = JSON.parse(String(fs.readFileSync('./src/database/stockHistory.json')));  
    for (let obj of data) {
      if (obj.label === label) {
        for (let torg of obj.history) {
            const curDate = date.split('-');
            const torgDate = torg.Date.split('/');
            if (torgDate[2] == curDate[0] &&
                torgDate[0] == curDate[1] &&
                torgDate[1] == curDate[2]) {
              return torg.Open;
            }
        }
      }
    }
  }
}
