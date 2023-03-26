export class Room{
    Id: number;
    UUID: string;
    departmentId: number;
    roomName: string;

    constructor(id?: number, uuid?: string, departmentID?: number, name?: string){
        this.Id = id; this.UUID = uuid; this.departmentId = departmentID; this.roomName = name;
    }
}