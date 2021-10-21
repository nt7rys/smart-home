import {Column, Entity, ObjectIdColumn} from "typeorm";

export enum DeviceType {
    FRIDGE = 'fridge',
    WASHING_MACHINE = 'washing_machine',
    LAMP = 'lamp'
}

export type DeviceInit = {
    name: string;
    uniqueId: string;
    type: DeviceType;
    location?: string;
    state: string;
    currentSocketId: string;
}

@Entity()
export class Device {
    @ObjectIdColumn()
    _id: string;

    @Column()
    currentSocketId: string;

    @Column()
    name: string;

    @Column()
    uniqueId: string;

    @Column()
    location: string;

    @Column()
    state: string;

    @Column()
    type: DeviceType;

    public disconnect(): Device {
        this.currentSocketId = '';

        return this;
    }

    public connect(socketId: string): Device {
        this.currentSocketId = socketId;

        return this;
    }

    public updateState(state: string): Device {
        this.state = state;

        return this;
    }

    public init(data: DeviceInit): Device {
        this.name = data.name;
        this.uniqueId = data.uniqueId;
        this.type = data.type
        this.location = data.location;
        this.state = data.state;
        this.currentSocketId = data.currentSocketId;

        return this;
    }
}
