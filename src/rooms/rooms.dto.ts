import { IsString, IsNumber, IsOptional } from 'class-validator';


export class RoomCreationParams {

    @IsString()
    roomName: string
}

export class RoomPatchParams {

    @IsString()
    @IsOptional()
    roomName?: string;
}
