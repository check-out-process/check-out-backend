import { Sector } from "src/sectors/sectors.entities";
import { Column, Entity, Generated, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";


@Entity()
export class ProcessType {
    @PrimaryColumn({unique: true})
    uuid: string;

    @Column({unique: true})
    @Generated('increment')
    id: number;

    @Column({unique: true})
    name: string;

    @ManyToMany(() => Sector, (sector) => sector.processTypes)
    relatedSectors: Sector[];

}

@Entity()
export class ProcessTemplate {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @ManyToOne(() => ProcessType, {eager: true})
    @JoinColumn()
    processType: ProcessType;

    @ManyToMany(() => Sector, (sector) => sector.relatedProcesses, {eager: true})
    @JoinTable()
    // @JoinTable({
    //     name: "process_template_related_sectors",
    //     joinColumns: [
    //         {name: "process_template_id", referencedColumnName: "id"},
    //         {name: "process_template_name", referencedColumnName: "name"}
    //     ],
    //     inverseJoinColumns: [
    //         {name: "sector_id", referencedColumnName: "id"},
    //         {name: "sector_name", referencedColumnName: "name"}
    //     ]
    // })
    relatedSectors: Sector[];

    @Column("simple-array")
    relatedSectorsOrder: string[]

}