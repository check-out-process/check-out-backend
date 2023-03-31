import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Room{

    @PrimaryColumn({unique: true})
    UUID: string;

    @Column()
    departmentId: string;

    @Column()
    roomName: string;

    constructor(uuid?: string, departmentID?: string, name?: string){
        this.UUID = uuid; this.departmentId = departmentID; this.roomName = name;
    }
}