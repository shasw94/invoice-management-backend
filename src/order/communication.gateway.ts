import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'http';

@WebSocketGateway(5001, {cors: true})
export class CommunicationGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
