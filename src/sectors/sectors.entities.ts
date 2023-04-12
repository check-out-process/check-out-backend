import { ProcessTemplate, ProcessType } from "src/process-templates/process-templates.entities";
import { User } from "src/users/users.entities";
import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from "typeorm";

@Entity()
export class Sector {
    @PrimaryColumn({unique: true})
    ID: string;

    @Column({unique: true})
    sectorName: string;

    // change it to OneToOne 
    @Column()
    defaultResponsibleUserId: number;

    // add default responsibles

    @ManyToMany(() => User, (user) => user.sectors)
    @JoinTable()
    commitersUsers: Promise<User[]>; 

    @ManyToMany(() => ProcessTemplate, (processTemplate) => processTemplate.relatedSectors)
    relatedProcesses: ProcessTemplate[];

    @PrimaryColumn()
    processTypes: ProcessType[]

}

export class SectorResponsible {
    @PrimaryColumn()
    ID: string;

    @Column()
    sectorId: string;

    @Column()
    userId: number;
}