import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Bed {
    @PrimaryColumn({unique: true})
    Id: Number;

    @Column({unique: true})
    UUID: String;

    @Column()
    roomId: number;

    @Column({unique: true})
    textQR: string;

    constructor(id?: number, uuid?: string, roomId?: number, QR?: string){
        this.Id = id; this.UUID = uuid; this.roomId = roomId; this.textQR = QR;
    }
}