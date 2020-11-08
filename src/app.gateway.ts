import { UserService } from 'src/user/shared/user.service';
import { Logger, SetMetadata, UseGuards } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { JwtAuthGuard } from './auth/shared/jwt-auth.guard';
import { RolesGuard } from './auth/shared/roles.guard';


@WebSocketGateway()

export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private sUser: UserService
    ) {

    }

    @WebSocketServer() wss: Server;

    private logger: Logger = new Logger('AppGateway');

    afterInit(server: Server){
        this.logger.log('Inialized!');
    }

    handleDisconnect(client: Socket){
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    handleConnection(client: Socket){
        this.logger.log(`Client connected: ${client.id}`);
    }

    @SubscribeMessage('join')
    async handleMessage(client: Socket, data: any) {
        // Entra na room da própria id
        client.join([data, 'global']);
        const user = await this.sUser.getById(data);
        if(user.roles.indexOf('user') > -1){
            client.join('user_notification');
        }
        if(user.roles.indexOf('customer') > -1){
            client.join('customer_notification');
        }
    }

    @SubscribeMessage('global')
    async globalMessage(client: Socket, data: any) {
        this.wss.in('global').emit('global notification', data);
    }

    @SubscribeMessage('join room')
    joinChat(client: Socket, id: any): void {
        this.logger.log(`Cliente ${client.id} entrou na sala ${id}`);
        client.join(id);
    }
    
    @SubscribeMessage('leave room')
    leaveChat(client: Socket, id: any): void {
        this.logger.log(`Cliente ${client.id} saiu da sala ${id}`);
        client.leave(id);
    }

    @SubscribeMessage('send message')
    sendMessage(client: Socket, data: any): void {
        this.wss.in(data.room).emit('message sent', data);
    }

    @SubscribeMessage('is typing')
    sendTyping(client: Socket, data: any): void {
        this.wss.in(data.room).emit('typing sent', data);
    }

    @SubscribeMessage('remove typing')
    removeTyping(client: Socket, data: any): void {
        this.wss.in(data.room).emit('typing sent', data);
    }
    
}