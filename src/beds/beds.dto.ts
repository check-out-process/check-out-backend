import { IsOptional, IsString } from "class-validator";

export class BedCreationParams {

    @IsString()
    textQR: string;

    @IsString()
    name: string;
}

export class BedPatchParams {

    @IsString()
    @IsOptional()
    textQR?: string;

    @IsOptional()
    @IsString()
    name?: string;
}