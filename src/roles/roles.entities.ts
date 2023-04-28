import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Role {
    @PrimaryColumn()
    id: string;

    @Column({unique: true})
    name: string;
}