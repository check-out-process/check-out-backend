import { ProcessTemplate, ProcessType } from "src/process-templates/process-templates.entities";
import { User } from "src/users/users.entities";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";

@Entity()
export class Sector {
    @PrimaryColumn({unique: true})
    id: string;

    @Column({unique: true})
    name: string;

    @ManyToOne(()=> User, {eager: true})
    @JoinColumn()
    defaultResponsibleUser: User;
 
    @ManyToMany(()=> User, (user) => user.sectors_in_responsibility, {eager:true})
    @JoinTable()
    // @JoinTable({
    //     name: "sector_responsible_users",
    //     joinColumns: [
    //         {name: "sector_id", referencedColumnName: "id"},
    //         {name: "sector_name", referencedColumnName: "name"}
    //     ],
    //     inverseJoinColumns: [
    //         {name: "responsible_user_id", referencedColumnName: "id"},
    //         {name: "responsible_user_name", referencedColumnName: "fullname"}
    //     ]
    // })
    responsibleUsers: Promise<User[]>;

    @ManyToMany(() => User, (user) => user.sectors, {eager: true})
    @JoinTable()
    // @JoinTable({
    //     name: "sector_committing_users",
    //     joinColumns: [
    //         {name: "sector_id", referencedColumnName: "id"},
    //         {name: "sector_name", referencedColumnName: "name"}
    //     ],
    //     inverseJoinColumns: [
    //         {name: "user_id", referencedColumnName: "id"},
    //         {name: "user_name", referencedColumnName: "fullname"}
    //     ]
    // })
    committingUsers: Promise<User[]>; 

    @ManyToMany(() => ProcessTemplate, (processTemplate) => processTemplate.relatedSectors)
    relatedProcesses: ProcessTemplate[];

    @ManyToMany(() => ProcessType, (pt) => pt.relatedSectors, {eager: true})
    @JoinTable()
    // @JoinTable({
    //     name: "sector_process_type",
    //     joinColumns: [
    //         {name: "sector_id", referencedColumnName: "id"},
    //         {name: "sector_name", referencedColumnName: "name"}
    //     ],
    //     inverseJoinColumns: [
    //         {name: "process_type_name", referencedColumnName: "name"},
    //         {name: "process_type_id", referencedColumnName: "id"}
    //     ]
    // })
    processTypes: ProcessType[];

}