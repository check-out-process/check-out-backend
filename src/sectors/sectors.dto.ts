import { IsString, IsNumber, IsOptional } from "class-validator";

export class SectorCreationParams {
    @IsString()
    sectorName: string;

    @IsNumber()
    defaultResponsibleUserId: number;
}

export class SectorPatchParams {
    @IsString()
    @IsOptional()
    sectorName?: string;

    @IsNumber()
    @IsOptional()
    defaultResponsibleUserId?: number;
}