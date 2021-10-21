import {Injectable} from "@nestjs/common";
import {CommunicationService} from "../communication/communication.service";

export interface EventMessage {
    auth: {
        type? : string;
        uniqueId?: string;
    },
    action: any;
}

@Injectable()
export class DeviceManagerService {
    constructor(
        private readonly communicationService: CommunicationService
    ) {}

    public toggleAllLamps(direction: string) {
        const message: EventMessage = {
            auth: {
                type: 'lamp',
            },
            action: {
                toggle: direction
            }
        }

        this.emitEvent(message);
    }

    public toggleLamp(uniqueId: string, direction: string) {
        const message: EventMessage = {
            auth: {
                uniqueId
            },
            action: {
                toggle: direction
            }
        }

        this.emitEvent(message);
    }

    public toggleAllFridges(direction: string) {
        const message: EventMessage = {
            auth: {
                type: 'fridge',
            },
            action: {
                toggle: direction
            }
        }

        this.emitEvent(message);
    }

    public toggleFridge(uniqueId: string, direction: string) {
        const message: EventMessage = {
            auth: {
                uniqueId
            },
            action: {
                toggle: direction
            }
        }

        this.emitEvent(message);
    }

    private emitEvent(message: EventMessage) {
        this.communicationService.server.emit('event', JSON.stringify(message));
    }
}
