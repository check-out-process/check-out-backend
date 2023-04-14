import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Department {

    @PrimaryColumn({unique: true})
    id: string;

    @Column()
    name: string;

    constructor(id?: string, name?: string ){
         this.id = id; this.name = name;
    }
}
