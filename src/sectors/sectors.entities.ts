import { IsString, IsNumber } from "class-validator";

export class Sector {

}

export class SectorResponsible {
    @IsNumber()
    id: number;

    @IsString()
    sectorName: string;

    @IsNumber()
    defaultResponsibleUserId: number;
}