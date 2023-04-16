import { Bed } from "src/beds/beds.entities";
import { ProcessType } from "src/process-templates/process-templates.entities";
import { User } from "src/users/users.entities";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, JoinTable, ManyToOne, OneToMany, OneToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { SectorInstance } from "./sector-instance.entities";

@Entity()
export class ProcessInstance{
    @PrimaryColumn()
    instanceId: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @ManyToOne(() => ProcessType, {eager: true})
    @JoinColumn()
    processType: ProcessType;

    @OneToMany(() => SectorInstance, (sectorInstance)=> sectorInstance.process, {eager: true, cascade: true})
    @JoinTable()
    // @JoinTable({
    //     name: "sector_instance_in_process_instance",
    //     joinColumns: [
    //         {name: "processInstanceId", referencedColumnName: "instanceId"},
    //         {name: "processInstanceName", referencedColumnName: "name"}
    //     ],
    //     inverseJoinColumns: [
    //         {name: "sectorId", referencedColumnName: "instanceId"},
    //         {name: "sectorName", referencedColumnName: "name"}
    //     ]
    // })
    sectorInstances: SectorInstance[];

    @Column("simple-array")
    sectorsOrder: string[]

    @ManyToOne(() => User, {eager: true})
    @JoinColumn({name: "creatorId", referencedColumnName: "id"})
    creator: User;

    @OneToOne(()=> Bed, {eager:true})
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
}