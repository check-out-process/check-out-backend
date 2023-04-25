import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Role {
    @PrimaryColumn()
    uuid: string;

    @Column({unique: true})
    id: number;

    @Column({unique: true})
    name: string;
}