import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Bed {
    @PrimaryColumn({unique: true})
    Id: number;

    @Column({unique: true})
    UUID: string;

    @Column()
    roomId: number;

    @Column({unique: true})
    textQR: string;

    constructor(id?: number, uuid?: string, roomId?: number, QR?: string){
        this.Id = id; this.UUID = uuid; this.roomId = roomId; this.textQR = QR;
    }
}