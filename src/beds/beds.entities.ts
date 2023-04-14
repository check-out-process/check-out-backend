import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Bed {

    @PrimaryColumn({unique: true})
    id: string;

    @Column()
    name: string;

    @Column()
    departmentId: string;
    
    @Column()
    roomId: string;

    @Column({unique: true})
    textQR: string;

    constructor(id?: string, roomId?: string, name?: string, QR?: string, departmentId?: string){
        this.id = id; this.roomId = roomId; this.textQR = QR; this.name = name; this.departmentId = departmentId;
    }
}