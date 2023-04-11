import { Status } from "@checkout/types";
import { Bed } from "src/beds/beds.entities";
import { ProcessType } from "src/process-templates/processes.entities";
import { User } from "src/users/users.entities";
import { Column, CreateDateColumn, Entity, Generated, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class SectorInstance {
    @PrimaryColumn({unique: true})
    instanceId: string;

    @Column()
    sectorId: string;

    @Column()
    name: string;

    @ManyToOne(() => ProcessInstance, (proc) => proc.sectorInstances)
    process: ProcessInstance;

    @Column({
        type: "enum",
        enum: Status,
        default: Status.Waiting
    })
    status: Status;

    @OneToOne(() => User, {eager: true})
    commitingWorker: User;

    @OneToOne(() => User, {eager: true})
    responsiblePerson: User; 

    @OneToOne(() => Bed, {eager: true})
    bed: Bed;

    @CreateDateColumn({type: 'datetime'})
    createdAt: Date;

    @UpdateDateColumn({type: 'datetime'})
    updatedAt: Date;

    @Column({
        type: 'datetime',
        nullable: true,
      })
    @Index()
    endedAt: Date;


}

@Entity()
export class ProcessInstance{
    @PrimaryColumn()
    instanceId: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @OneToOne(() => ProcessType, {eager: true})
    @JoinColumn({referencedColumnName: "name"})
    processType: ProcessType;

    @OneToMany(() => SectorInstance, (sectorInstance)=> sectorInstance.process, {eager: true})
    @JoinTable()
    sectorInstances: SectorInstance[];

    @Column("simple-array")
    sectorsOrder: string[]

    @OneToOne(() => User, {eager: true})
    @JoinColumn([
        {name: "creatorId", referencedColumnName: "id"},
        {name: "creatorName", referencedColumnName: "fullname"}
    ])
    creator: User;

    @OneToOne(()=> Bed, {eager:true})
    @JoinColumn([
        {name: "DepartmentId", referencedColumnName: "departmentId"},
        {name: "BedID", referencedColumnName: "ID"}
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
    @Index()
    endedAt: Date;
}