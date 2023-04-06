import { User } from "src/users/users.entities";
import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from "typeorm";

@Entity()
export class Sector {
    @PrimaryColumn()
    ID: string;

    @Column()
    sectorName: string;

    @Column()
    defaultResponsibleUserId: number;

    @ManyToMany(() => User, (user) => user.sectors)
    @JoinTable()
    commitersUsers: Promise<User[]>; 

}

export class SectorResponsible {
    @PrimaryColumn()
    ID: string;

    @Column()
    sectorId: string;

    @Column()
    userId: number;
}