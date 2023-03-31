import { IsOptional, IsString } from "class-validator"

export class DepartmentPatchParams {
    @IsOptional()
    @IsString()
    Name?: string
}

export class DepartmentCreationParams {
    @IsString()
    Name: string
}