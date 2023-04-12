import { Sector } from "src/sectors/sectors.entities";
import { User } from "src/users/users.entities";
import { Column, CreateDateColumn, Entity, Generated, Index, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class ProcessType {
    @PrimaryColumn({unique: true})
    uuid: string;

    @Column({unique: true})
    @Generated('increment')
    id: number;

    @Column({unique: true})
    name: string;
}

@Entity()
export class ProcessTemplate {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @OneToOne(() => ProcessType, {eager: true})
    @JoinColumn()
    processType: ProcessType;

    @ManyToMany(() => Sector, (sector) => sector.relatedProcesses, {eager: true})
    @JoinTable()
    relatedSectors: Sector[];

    @Column("simple-array")
    relatedSectorsOrder: string[]
}