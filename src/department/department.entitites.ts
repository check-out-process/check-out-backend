export class Department {
    Id: Number;
    UUID: String;
    Name: String;

    constructor(id?: number, uuid?: string, name?: string ){
        this.Id = id; this.UUID = uuid; this.Name = name;
    }
}
