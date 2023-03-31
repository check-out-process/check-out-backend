import { Column, PrimaryColumn } from "typeorm";

export class Sector {
    @PrimaryColumn()
    id: string;

    @Column()
    sectorName: string;

    @Column()
    defaultResponsibleUserId: number;

}

export class SectorResponsible {
    @PrimaryColumn()
    id: string;

    @Column()
    sectorId: string;

    @Column()
    userId: number;
}