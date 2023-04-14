import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Bed {

    @PrimaryColumn({unique: true})
    ID: string;

    @Column()
    roomId: string;

    @Column()
    name: string;

    @Column({unique: true})
    textQR: string;

    constructor(id?: string, roomId?: string, name?: string, QR?: string){
        this.ID = id;
        this.roomId = roomId;
        this.textQR = QR;
        this.name = name;
    }
}