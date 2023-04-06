import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from "typeorm";
import {Role} from '@checkout/types'
import { Sector } from "src/sectors/sectors.entities";

@Entity()
export class User {
    @PrimaryColumn({unique: true})
    id : number;

    @Column()
    fullname: string;

    @Column({unique: true})
    username : string;

    @Column({nullable: true})
    job: number;

    @Column()
    role: Role;

    @ManyToMany(() => Sector, (sector) => sector.commitersUsers)
    sectors: Promise<Sector[]>;
}