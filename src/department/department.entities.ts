import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Department {

    @PrimaryColumn({unique: true})
    Id: number;

    @Column({unique: true})
    UUID: string;

    @Column()
    Name: string;

    constructor(id?: number, uuid?: string, name?: string ){
        this.Id = id; this.UUID = uuid; this.Name = name;
    }
}
