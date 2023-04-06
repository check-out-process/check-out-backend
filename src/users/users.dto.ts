import { Role } from "@checkout/types";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class UserCreationParams {
    @IsNumber()
    id : number;

    @IsString()
    fullname: string;

    @IsString()
    username : string;

    @IsNumber()
    job: number;

    @IsEnum(Role)
    role: Role;
}

export class UserPatchParams {

    @IsNumber()
    @IsOptional()
    job?: number;

    @IsEnum(Role)
    @IsOptional()
    role?: Role;
}

export class UserPatchAddSectorParams {
    @IsString()
    sectorID: string
}
