import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryColumn } from "typeorm";
import { Sector } from "src/sectors/sectors.entities";
import { Job } from "src/jobs/jobs.entities";
import { Role } from "src/roles/roles.entities";

@Entity()
export class User {
    @PrimaryColumn({unique: true})
    id : number;

    @Column()
    fullname: string;

    @Column({unique: true})
    username : string;

    @Column()
    phoneNumber: string;

    @ManyToOne(() => Job, {eager: true})
    @JoinColumn()
    job: Job;

    @ManyToOne(() => Role, {eager: true})
    @JoinColumn()
    role: Role;

    @ManyToMany(() => Sector, (sector) => sector.committingUsers)
    sectors: Promise<Sector[]>;

    @ManyToMany(() => Sector, (sector) => sector.responsibleUsers)
    sectors_in_responsibility: Promise<Sector[]>
}