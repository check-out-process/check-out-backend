import { IsString, IsNumber, IsOptional, IsArray, IsObject } from "class-validator";

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

export class SectorPatchAddUserParams {
    @IsNumber()
    @IsOptional()
    userId: number;
}