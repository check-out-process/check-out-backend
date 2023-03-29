import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Department {

    @PrimaryColumn({unique: true})
    Id: Number;

    @Column({unique: true})
    UUID: String;

    @Column()
    Name: String;

    constructor(id?: number, uuid?: string, name?: string ){
        this.Id = id; this.UUID = uuid; this.Name = name;
    }
}
