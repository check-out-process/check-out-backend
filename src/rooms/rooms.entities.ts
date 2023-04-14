import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Room{

    @PrimaryColumn({unique: true})
    id: string;

    @Column()
    departmentId: string;

    @Column()
    name: string;

    constructor(id?: string, departmentId?: string, name?: string){
        this.id = id; this.departmentId = departmentId; this.name = name;
    }
}