import { Bed } from "./beds.entities";
import fetch from 'node-fetch';

export class BedsHelper{
    public static async getBedById(departmentId: string, roomId: string, bedId: string): Promise<Bed>{
        const url = `http://localhost:3000/departments/${departmentId}/rooms/${roomId}/beds/${bedId}`;
        const res = await fetch(url);
        const bed : Bed = await res.json();
        return bed;
    }
}