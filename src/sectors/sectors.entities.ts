import { ProcessTemplate, ProcessType } from "../process-templates/process-templates.entities";
import { User } from "../users/users.entities";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";

@Entity()
export class Sector {
    @PrimaryColumn({unique: true})
    id: string;

    @Column({unique: true})
    name: string;

    @ManyToOne(()=> User, {eager: true, nullable: true})
    @JoinColumn()
    defaultResponsibleUser?: User;
 
    @ManyToMany(()=> User, (user) => user.sectors_in_responsibility, {eager:true, nullable: true})
    @JoinTable()
    responsibleUsers?: User[];

    @ManyToOne(()=> User, {eager: true, nullable: true})
    @JoinColumn()
    defaultCommittingUser?: User;

    @ManyToMany(() => User, (user) => user.sectors, {eager: true})
    @JoinTable()
    committingUsers: User[]; 

    @ManyToMany(() => ProcessTemplate, (processTemplate) => processTemplate.relatedSectors)
    relatedProcesses: ProcessTemplate[];

    @ManyToMany(() => ProcessType, (pt) => pt.relatedSectors, {eager: true})
    @JoinTable()
    processTypes: ProcessType[];

}