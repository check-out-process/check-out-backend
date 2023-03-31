import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Room{

    @PrimaryColumn({unique: true})
    ID: string;

    @Column()
    departmentId: string;

    @Column()
    roomName: string;

    constructor(id?: string, departmentID?: string, name?: string){
        this.ID = id; this.departmentId = departmentID; this.roomName = name;
    }
}