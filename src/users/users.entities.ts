import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Sector } from "src/sectors/sectors.entities";
import { Job } from "src/jobs/jobs.entities";
import { Role } from "src/roles/roles.entities";
import { Token } from "src/tokens/tokens.entities";

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
       
    @Column()
    password: string;

    @OneToMany(() => Token, (tokens)=> tokens.userId, {eager: true, cascade: true})
    @JoinColumn()
    tokens?: Token[];

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