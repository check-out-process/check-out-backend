import { IsNumberString, IsString, IsNumber, IsOptional } from 'class-validator';


export class RoomCreationParams {
    @IsNumber()
    Id: number;

    @IsNumber()
    departmentId: number;

    @IsString()
    roomName: string
}

export class RoomPatchParams {
    @IsNumber()
    @IsOptional()
    Id?: number;

    @IsNumber()
    @IsOptional()
    departmentId?: number;

    @IsString()
    @IsOptional()
    roomName?: string;
}
