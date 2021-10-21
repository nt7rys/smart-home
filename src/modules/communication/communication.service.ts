import {
    OnGatewayDisconnect, OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets";
import {Connection, MongoEntityManager} from "typeorm";
import {InjectConnection} from "@nestjs/typeorm";
import {Logger} from "@nestjs/common";

import {Device} from "../../entities/device.entity";
import {Log} from "../../entities/log.entity";

@WebSocketGateway()
export class CommunicationService implements OnGatewayDisconnect, OnGatewayInit {
    @WebSocketServer() public server;
    private readonly mongoManager: MongoEntityManager;
    private readonly logger: Logger;

    constructor(
        @InjectConnection()
        private readonly connection: Connection
    ) {
        this.logger = new Logger('WebSocket');
        this.mongoManager = this.connection.mongoManager;
    }

    public afterInit(server: any): any {
        this.logger.verbose('Socket connection initialized!');
    }

    public async handleDisconnect(client: any): Promise<void> {
        const device = await this.mongoManager.findOne(Device, {
            where: {
                currentSocketId: client.conn.id
            }
        });

        if (!device) {
            await this.log(`Unknown device disconnected! (${client.conn.id})`);
        } else {
            await this.mongoManager.save(device.disconnect());
            await this.log(`Device has disconnected: ${device.name}`);
        }
    }

    @SubscribeMessage('register')
    public async onRegister(client, message) {
        const info = JSON.parse(message);
        console.log(`Register: ${client.conn.id}:`);
        console.log(info);

        let device = await this.mongoManager.findOne(Device, {
            where: {
                uniqueId: info.uniqueId
            }
        });

        if (!device) {
            device = await this.mongoManager.save(new Device().init({
                ...info,
                currentSocketId: client.conn.id
            }));
            await this.log(`Device has registered: ${device.name}`);
        } else {
            await this.mongoManager.save(device.connect(client.conn.id));
            await this.log(`Device has reconnected: ${device.name}`);
        }
    }

    @SubscribeMessage('update')
    public async onUpdate(client, message) {
        const device = await this.mongoManager.findOne(Device, {
            where: {
                currentSocketId: client.conn.id
            }
        });

        if (!device) {
            await this.log(`Message from unknown device (${client.conn.id})`);
        } else {
            try {
                const messageObj = JSON.parse(message);
                if(!messageObj.state) {
                    // noinspection ExceptionCaughtLocallyJS
                    throw 'invalid_message';
                }
                const previousState = device.state;
                await this.mongoManager.save(device.updateState(messageObj.state))
                await this.log(`Device (${device.name}) state changed from: ${previousState} to: ${device.state}`, message);
            } catch (error) {
                await this.log(`Invalid state update from device ${device.name}`, message);
            }
        }
    }

    @SubscribeMessage('event')
    public async onEvent(client: any, message: string): Promise<void> {
        const device = await this.mongoManager.findOne(Device, {
            where: {
                currentSocketId: client.conn.id
            }
        });

        if (!device) {
            await this.log(`Message from unknown device (${client.conn.id})`);
        } else {
            await this.log(`Message was received from device ${device.name}`, message);
        }
    }

    private async log(content: string, data?: any) {
        this.logger.verbose(content);
        if(data) {
            this.logger.verbose(data);
        }
        await this.mongoManager.save(new Log().init(content, data));
    }
}
