import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Department {

    @PrimaryColumn({unique: true})
    ID: string;

    @Column()
    Name: string;

    constructor(id?: string, name?: string ){
         this.ID = id; this.Name = name;
    }
    
    // public toJson(){
    //     return {
    //         id: this.ID,
    //         name: this.Name
    //     }
    // }
}
