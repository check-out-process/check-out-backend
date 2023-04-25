import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Job {
    @PrimaryColumn({unique: true})
    id: string;

    @Column()
    name: string;
}