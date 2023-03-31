import { IsString, IsNumber } from "class-validator";

export class Sector {
    @IsString()
    id: string;

    @IsString()
    sectorName: string;

    @IsNumber()
    defaultResponsibleUserId: number;

}

export class SectorResponsible {
    @IsString()
    id: string;

    @IsString()
    sectorId: string;

    @IsNumber()
    userId: number;
}