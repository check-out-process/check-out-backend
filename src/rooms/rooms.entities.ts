import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Room{
    @PrimaryColumn({unique: true})
    Id: number;

    @Column({unique: true})
    UUID: string;

    @Column()
    departmentId: number;

    @Column()
    roomName: string;

    constructor(id?: number, uuid?: string, departmentID?: number, name?: string){
        this.Id = id; this.UUID = uuid; this.departmentId = departmentID; this.roomName = name;
    }
}