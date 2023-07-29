import { Bed } from "../beds/beds.entities";
import { ProcessType } from "../process-templates/process-templates.entities";
import { User } from "../users/users.entities";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, JoinTable, ManyToOne, OneToMany, OneToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { SectorInstance } from "./sector-instance.entities";
import { Status } from "@checkout/types";
import { Room } from "../rooms/rooms.entities";
import { Department } from "../department/department.entities";

@Entity()
export class ProcessInstance{
    @PrimaryColumn()
    instanceId: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @ManyToOne(()=> Department, {eager:true})
    @JoinColumn([
        {name: "departmentId", referencedColumnName: "id"}
    ])
    department: Department;

    @ManyToOne(()=> Room, {eager:true})
    @JoinColumn([
        {name: "roomId", referencedColumnName: "id"}
    ])
    room: Room;

    @ManyToOne(() => ProcessType, {eager: true})
    @JoinColumn()
    processType: ProcessType;

    @OneToMany(() => SectorInstance, (sectorInstance)=> sectorInstance.process, {eager: true, cascade: true})
    @JoinTable()
    sectorInstances: SectorInstance[];

    @Column({
        default: Status.In_Progress
    })
    status: Status;

    @Column("simple-array")
    sectorsOrder: string[]

    @ManyToOne(() => User, {eager: true})
    @JoinColumn({name: "creatorId", referencedColumnName: "id"})
    creator: User;

    @ManyToOne(()=> Bed, {eager:true})
    @JoinColumn([
        {name: "bedId", referencedColumnName: "id"}
    ])
    bed: Bed;

    @CreateDateColumn({type: 'datetime'})
    createdAt: Date;

    @UpdateDateColumn({type: 'datetime'})
    updatedAt: Date;

    @Column({
        type: 'datetime',
        nullable: true,
      })
    endedAt: Date;

    @Column()
    isIsolation: boolean;
}