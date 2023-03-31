import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Department {

    @PrimaryColumn({unique: true})
    UUID: string;

    @Column()
    Name: string;

    constructor(uuid?: string, name?: string ){
         this.UUID = uuid; this.Name = name;
    }
}
