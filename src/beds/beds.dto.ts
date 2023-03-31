import { IsOptional, IsString } from "class-validator";

export class BedCreationParams {

    @IsString()
    textQR: string;
}

export class BedPatchParams {

    @IsString()
    @IsOptional()
    textQR?: string;
}