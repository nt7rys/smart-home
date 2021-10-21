import {Column, Entity, ObjectIdColumn} from "typeorm";

@Entity()
export class Log {
    @ObjectIdColumn()
    _id: string;

    @Column()
    content: string;

    @Column()
    data: any;

    @Column()
    timestamp: number;

    public init(content: string, data: any): Log {
        this.content = content;
        this.data = data;
        this.timestamp = Date.now();

        return this;
    }
}
