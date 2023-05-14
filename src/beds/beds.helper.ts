import { Bed } from "./beds.entities";
import fetch from 'node-fetch';

export class BedsHelper{
    public static async getBedById(bedId: string): Promise<Bed>{
        const url = `http://localhost:8080/beds/${bedId}`;
        const res = await fetch(url);
        const bed : Bed = await res.json();
        return bed;
    }
}