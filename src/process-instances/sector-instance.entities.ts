import { Status } from "@checkout/types";
import { Bed } from "src/beds/beds.entities";
import { User } from "src/users/users.entities";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { ProcessInstance } from "./process-instances.entities";


@Entity()
export class SectorInstance {
    @PrimaryColumn({ unique: true })
    instanceId: string;

    @Column()
    sectorId: string;

    @Column()
    name: string;

    @ManyToOne(() => ProcessInstance, (proc) => proc.sectorInstances)
    process: ProcessInstance;

    @Column({
        default: Status.Waiting_Confirm
    })
    status: Status;

    @ManyToOne(() => User, { eager: true })
    commitingWorker: User;

    @ManyToOne(() => User, { eager: true, nullable: true })
    responsiblePerson?: User;

    @ManyToOne(() => Bed, { eager: true })
    bed: Bed;

    @CreateDateColumn({ type: 'datetime' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'datetime' })
    updatedAt: Date;

    @Column({
        type: 'datetime',
        nullable: true,
    })
    endedAt: Date;


}